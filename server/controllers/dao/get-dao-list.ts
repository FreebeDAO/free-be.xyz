import { prisma } from "../../../prisma";
import { fetch } from "../../utils/client";
import { server as getUser } from "../user/get-user";

type Params = {
    creator?: string;
    search?: string;
};

const server = async (params: Params) => {
    if (!params.creator) {
        return prisma.dao.findMany({
            where: {
                name: { contains: params.search },
            },
        });
    }

    const user = await getUser({ account: params.creator });

    if (!user) {
        return [];
    }

    const daoList = await prisma.dao.findMany({
        where: {
            creator_id: user.id,
        },
    });

    return daoList;
};

const client: typeof server = (params) => {
    return fetch(target, params) as any;
};

const target = "GET /api/getDaoList";

export { target, client, server };
