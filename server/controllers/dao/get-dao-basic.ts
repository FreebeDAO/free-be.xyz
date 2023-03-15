import { prisma } from "../../../prisma";
import { fetch } from "../../utils/client";
import { server as getDao } from "./get-dao";

type Params = {
    account?: string;
};

const server = async (params: Params) => {
    const dao = await getDao({ account: params.account });

    if (!dao) {
        throw new Error("Dao not found");
    }

    const rewardList = await prisma.taskReward.groupBy({
        by: ["to_id"],
        where: {
            dao_id: dao.id,
            status: 2,
        },
        _sum: {
            reward: true,
        },
    });

    const userList = await prisma.user.findMany({
        where: {
            id: {
                in: rewardList
                    .map((reward) => reward.to_id)
                    .concat(dao.creator_id),
            },
        },
    });

    const totalRewardAmount = rewardList.reduce(
        (sum, v) => sum + (v._sum.reward ?? 0),
        0
    );

    const userRewardRecords = Object.fromEntries(
        rewardList.map((reward) => [reward.to_id, reward._sum.reward])
    );

    return userList.map((user) => {
        const amount = userRewardRecords[user.id] || 0;
        const percent = totalRewardAmount
            ? Math.floor((amount / totalRewardAmount) * 100)
            : 0;

        return {
            ...user,
            reward: {
                amount,
                percent,
            },
        };
    });
};

const client: typeof server = (params: Params) => {
    return fetch(target, params) as any;
};

const target = "GET /api/getDaoBasic";

export { target, client, server };
