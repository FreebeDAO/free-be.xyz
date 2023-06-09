import dayjs from "dayjs";
import { prisma } from "../../../../../prisma";
import { fetch } from "../../../../utils/client";
import { decodeJWT } from "../../../../utils/jwt";

type Params = {
    dao_id: number;
    task_id: number;
    content: string;
};

const server = async (params: Params, headers = {}) => {
    const token = Reflect.get(headers, "token");
    const session = decodeJWT(token);

    if (!session) {
        throw new Error("Not allowed");
    }

    await prisma.task.findFirstOrThrow({
        where: {
            id: params.task_id,
            dao_id: params.dao_id,
        },
    });

    const comment = await prisma.taskComment.create({
        data: {
            task_id: params.task_id,
            content: params.content,
            creator_id: session.id,
            created_at: dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        },
    });

    return comment;
};

const client: typeof server = (params: Params) => {
    return fetch(target, params) as any;
};

const target = "POST /api/createDaoTaskComment";

export { target, client, server };
