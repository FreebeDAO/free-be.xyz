import { prisma } from "../../../../prisma";
import { fetch } from "../../../utils/client";
import { server as getDao } from "../get-dao";

type Params = {
    account?: string;
};

const server = async (params: Params) => {
    const dao = await getDao({ account: params.account });

    if (!dao) return [];

    const taskList = await prisma.task.findMany({
        where: {
            dao_id: dao.id,
        },
    });

    const userList = await prisma.user.findMany({
        where: {
            id: {
                in: taskList
                    .map((task) => [task.creator_id, task.assignee_id ?? 0])
                    .flat()
                    .filter(Boolean),
            },
        },
    });

    return taskList.map((task) => ({
        ...task,
        key_results: JSON.parse(task.key_results),
        creator: userList.find((user) => user.id === task.creator_id),
        assignee: userList.find((user) => user.id === task.assignee_id),
    }));
};

const client: typeof server = async (params) => {
    return fetch(target, params) as any;
};

const target = "GET /api/getDaoTaskList";

export { target, client, server };
