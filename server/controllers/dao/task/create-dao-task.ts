import dayjs from "dayjs";
import { prisma } from "../../../../prisma";
import { fetch } from "../../../utils/client";
import { decodeJWT } from "../../../utils/jwt";

type Params = {
    dao_id: number;
    name: string;
    deadline: string;
    reward: number;
    objective: string;
    key_results: string[];
};

const server = async (params: Params, headers = {}) => {
    const token = Reflect.get(headers, "token");
    const session = decodeJWT(token);

    if (!session) {
        throw new Error("Not allowed");
    }

    await prisma.dao.findFirstOrThrow({
        where: {
            id: params.dao_id,
            creator_id: session.id,
        },
    });

    const task = await prisma.task.create({
        data: {
            creator_id: session.id,
            dao_id: params.dao_id,
            name: params.name,
            deadline: params.deadline,
            reward: params.reward,
            objective: params.objective,
            key_results: JSON.stringify(
                params.key_results
                    .filter(Boolean)
                    .map((s) => ({ checked: false, content: s }))
            ),
            status: 1,
        },
    });

    await prisma.taskChange.create({
        data: {
            task_id: task.id,
            log: `@${session.account} created task at ${dayjs(
                Date.now()
            ).format("YYYY-MM-DD HH:mm:ss")}`,
            type: 1,
        },
    });

    return task;
};

const client: typeof server = (params: Params) => {
    return fetch(target, params) as any;
};

const target = "POST /api/createDaoTask";

export { target, client, server };
