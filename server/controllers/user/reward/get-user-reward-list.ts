import { prisma } from "../../../../prisma";
import { fetch } from "../../../utils/client";
import { server as getUser } from "../get-user";

type Params = {
    account?: string;
};

const server = async (params: Params) => {
    const user = await getUser({ account: params.account });

    if (!user) return [];

    const rewardList = await prisma.taskReward.findMany({
        where: {
            to_id: user.id,
        },
        orderBy: [
            { status: "asc" },
            { updated_at: "desc" },
            { created_at: "desc" },
        ],
    });

    const [daoList, taskList] = await Promise.all([
        prisma.dao.findMany({
            where: {
                id: {
                    in: rewardList.map((reward) => reward.dao_id),
                },
            },
        }),

        prisma.task.findMany({
            where: {
                id: {
                    in: rewardList.map((reward) => reward.task_id),
                },
            },
        }),
    ]);

    return rewardList.map((reward) => ({
        ...reward,
        dao: daoList.find((dao) => dao.id === reward.dao_id),
        task: taskList.find((task) => task.id === reward.task_id),
    }));
};

const client: typeof server = async (params) => {
    return fetch(target, params) as any;
};

const target = "GET /api/getUserRewardList";

export { target, client, server };
