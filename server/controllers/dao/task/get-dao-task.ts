import { prisma } from "../../../../prisma";
import { fetch } from "../../../utils/client";
import { server as getDao } from "../get-dao";

type Params = {
    dao: string;
    task: string;
};

const server = async (params: Params) => {
    const dao = await getDao({ account: params.dao });

    if (!dao) return null;

    const task = await prisma.task.findFirst({
        where: {
            dao_id: dao.id,
            id: Number(params.task),
        },
    });

    if (task) {
        const changes = await prisma.taskChange.findMany({
            where: { task_id: task.id },
        });

        return {
            ...task,
            key_results: JSON.parse(task.key_results),
            changes,
        };
    }

    return task;
};

const client: typeof server = (params: Params) => {
    return fetch(target, params) as any;
};

const target = "GET /api/getDaoTask";

export { target, client, server };
