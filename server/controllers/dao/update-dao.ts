import { prisma } from "../../../prisma";
import { fetch } from "../../utils/client";
import { decodeJWT } from "../../utils/jwt";

type Params = {
    id: number;
    name: string;
    logo: string;
    mission: string;
    color: string;
};

const server = async (params: Params, headers = {}) => {
    const token = Reflect.get(headers, "token");
    const session = decodeJWT(token);

    if (!session) {
        throw new Error("Not allowed");
    }

    await prisma.dao.findFirstOrThrow({
        where: {
            id: params.id,
            creator_id: session.id,
        },
    });

    const dao = await prisma.dao.update({
        where: { id: params.id },
        data: {
            name: params.name,
            logo: params.logo,
            mission: params.mission,
            color: params.color,
        },
    });

    return dao;
};

const client: typeof server = (params) => {
    return fetch(target, params) as any;
};

const target = "POST /api/updateDao";

export { target, client, server };
