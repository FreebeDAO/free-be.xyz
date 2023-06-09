import { SELECT_ACTIVITY, prisma } from "../../../../prisma";
import { fetch } from "../../../utils/client";
import { server as getDao } from "../get-dao";

type Params = {
    dao: string;
    task: string;
};

const server = async (params: Params) => {
    const dao = await getDao({ account: params.dao });

    if (!dao) return [];

    const task = await prisma.task.findFirst({
        where: {
            dao_id: dao.id,
            id: Number(params.task),
        },
    });

    if (!task) return [];

    const activityList: {
        type: "change" | "comment";
        id: number;
    }[] = await prisma.$queryRaw(SELECT_ACTIVITY(task.id));

    const changeList = await prisma.taskChange.findMany({
        where: {
            id: {
                in: activityList
                    .map((activity) =>
                        activity.type === "change" ? activity.id : 0
                    )
                    .filter(Boolean),
            },
        },
    });

    const commentList = await prisma.taskComment.findMany({
        where: {
            id: {
                in: activityList
                    .map((activity) =>
                        activity.type === "comment" ? activity.id : 0
                    )
                    .filter(Boolean),
            },
        },
    });

    return activityList.map((activity) => {
        if (activity.type === "change") {
            return {
                type: "change" as const,
                change: changeList.find((change) => change.id === activity.id),
            };
        }

        if (activity.type === "comment") {
            return {
                type: "comment" as const,
                comment: commentList.find(
                    (comment) => comment.id === activity.id
                ),
            };
        }

        throw new Error(`${activity.type} not exist`);
    });
};

const client: typeof server = async (params) => {
    return fetch(target, params) as any;
};

const target = "GET /api/getDaoTaskActivityList";

export { target, client, server };
