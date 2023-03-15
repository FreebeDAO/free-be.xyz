import { prisma } from "../../../prisma";
import { fetch } from "../../utils/client";

type Params = {
    account?: string;
};

const server = async (params: Params) => {
    const dao = await prisma.dao.findFirst({
        where: {
            account: params.account ?? "",
        },
    });

    return dao;
};

const client: typeof server = (params) => {
    return fetch(target, params) as any;
};

const target = "GET /api/getDao";

export { target, client, server };
