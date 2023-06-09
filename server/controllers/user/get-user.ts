import { prisma } from "../../../prisma";
import { fetch } from "../../utils/client";

type Params = {
    id?: number;
    account?: string;
};

const server = async (params: Params) => {
    if (params.account) {
        return prisma.user.findFirst({
            where: {
                account: params.account ?? "",
            },
        });
    }

    const user = await prisma.user.findFirst({
        where: { id: Number(params.id) ?? 0 },
    });

    return user;
};

const client: typeof server = (params) => {
    return fetch(target, params) as any;
};

const target = "GET /api/getUser";

export { target, client, server };
