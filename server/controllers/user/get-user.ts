import { prisma } from "../../../prisma";
import { fetch } from "../../utils/client";

type Params = {
    account?: string;
};

const server = async (params: Params) => {
    const user = await prisma.user.findFirst({
        where: {
            account: params.account ?? "",
        },
    });

    return user;
};

const client: typeof server = (params) => {
    return fetch(target, params) as any;
};

const target = "GET /api/getUser";

export { target, client, server };
