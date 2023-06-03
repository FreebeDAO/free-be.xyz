import { prisma } from "../../../../prisma";
import { fetch } from "../../../utils/client";
import { decodeJWT } from "../../../utils/jwt";
import dayjs from "dayjs";

type Params = {
    scene: "assign" | "update" | "review" | "approve";
    assign?: {
        id: number;
        dao_id: number;
    };
    update?: {
        id: number;
        dao_id: number;
        name: string;
        deadline: string;
        assignee_id: number;
        objective: string;
        key_results: { checked: boolean; content: string }[];
    };
    review?: {
        id: number;
        dao_id: number;
    };
    approve?: {
        id: number;
        dao_id: number;
    };
};

const server = async (params: Params, headers = {}) => {
    const token = Reflect.get(headers, "token");
    const session = decodeJWT(token);

    if (!session) {
        throw new Error("Not allowed");
    }

    if (params.scene === "assign") {
        const payload = params.assign;

        if (!payload) {
            throw new Error("Not allowed");
        }

        const { assignee_id } = await prisma.task.findFirstOrThrow({
            where: {
                id: payload.id,
                dao_id: payload.dao_id,
            },
        });

        if (assignee_id) {
            throw new Error("Not allowed");
        }

        const task = await prisma.task.update({
            where: { id: payload.id },
            data: {
                assignee_id: session.id,
                status: 2,
            },
        });

        await prisma.taskChange.create({
            data: {
                task_id: task.id,
                log: `@${session.account} request assign at ${dayjs(
                    Date.now()
                ).format("YYYY-MM-DD HH:mm:ss")}`,
                type: 2,
            },
        });

        return {
            ...task,
            key_results: JSON.parse(task.key_results),
        };
    }

    if (params.scene === "update") {
        const payload = params.update;

        if (!payload) {
            throw new Error("Not allowed");
        }

        const target = await prisma.task.findFirstOrThrow({
            where: {
                id: payload.id,
                dao_id: payload.dao_id,
            },
        });

        if (
            target.creator_id !== session.id &&
            target.assignee_id !== session.id
        ) {
            throw new Error("Not allowed");
        }

        const task = await prisma.task.update({
            where: { id: payload.id },
            data: {
                name: payload.name,
                deadline: payload.deadline,
                assignee_id: payload.assignee_id,
                objective: payload.objective,
                key_results: JSON.stringify(payload.key_results),
                status:
                    target.status === 2 && !payload.assignee_id ? 1 : undefined,
            },
        });

        const changes = [];
        for (const field of [
            "name",
            "deadline",
            "assignee_id",
            "objective",
            "key_results",
        ] as const) {
            if (target[field] !== task[field]) {
                changes.push(field);
            }
        }

        await prisma.taskChange.create({
            data: {
                task_id: task.id,
                log: `@${session.account} updated [${changes}] at ${dayjs(
                    Date.now()
                ).format("YYYY-MM-DD HH:mm:ss")}`,
                type: 3,
            },
        });

        return {
            ...task,
            key_results: JSON.parse(task.key_results),
        };
    }

    if (params.scene === "review") {
        const payload = params.review;

        if (!payload) {
            throw new Error("Not allowed");
        }

        const { assignee_id, key_results } = await prisma.task.findFirstOrThrow(
            {
                where: {
                    id: payload.id,
                    dao_id: payload.dao_id,
                },
            }
        );

        const isAssignee = assignee_id === session.id;
        const unchecked = JSON.parse(key_results).find((v: any) => !v.checked);
        if (!isAssignee || unchecked) {
            throw new Error("Not allowed");
        }

        const task = await prisma.task.update({
            where: { id: payload.id },
            data: {
                status: 3,
            },
        });

        await prisma.taskChange.create({
            data: {
                task_id: task.id,
                log: `@${session.account} request review at ${dayjs(
                    Date.now()
                ).format("YYYY-MM-DD HH:mm:ss")}`,
                type: 4,
            },
        });

        await prisma.taskReward.create({
            data: {
                dao_id: task.dao_id,
                task_id: task.id,
                reward: task.reward,
                from_id: task.creator_id,
                to_id: task.assignee_id ?? 0,
                created_at: dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                status: 1,
            },
        });

        return {
            ...task,
            key_results: JSON.parse(task.key_results),
        };
    }

    if (params.scene === "approve") {
        const payload = params.approve;

        if (!payload) {
            throw new Error("Not allowed");
        }

        const { creator_id, key_results } = await prisma.task.findFirstOrThrow({
            where: {
                id: payload.id,
                dao_id: payload.dao_id,
            },
        });

        const isCreator = creator_id === session.id;
        const unchecked = JSON.parse(key_results).find((v: any) => !v.checked);
        if (!isCreator || unchecked) {
            throw new Error("Not allowed");
        }

        const task = await prisma.task.update({
            where: { id: payload.id },
            data: {
                status: 4,
            },
        });

        await prisma.taskChange.create({
            data: {
                task_id: task.id,
                log: `@${session.account} approve review at ${dayjs(
                    Date.now()
                ).format("YYYY-MM-DD HH:mm:ss")}`,
                type: 5,
            },
        });

        const reward = await prisma.taskReward.findFirstOrThrow({
            where: {
                dao_id: task.dao_id,
                task_id: task.id,
                reward: task.reward,
                from_id: task.creator_id,
                to_id: task.assignee_id ?? 0,
                status: 1,
            },
        });

        await prisma.taskReward.update({
            where: { id: reward.id },
            data: {
                updated_at: dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                status: 2,
            },
        });

        return {
            ...task,
            key_results: JSON.parse(task.key_results),
        };
    }
};

const client: typeof server = (params: Params) => {
    return fetch(target, params) as any;
};

const target = "POST /api/updateDaoTask";

export { target, client, server };
