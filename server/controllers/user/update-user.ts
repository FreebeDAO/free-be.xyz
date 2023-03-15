import { prisma } from "../../../prisma";
import { fetch } from "../../utils/client";
import { decodeJWT } from "../../utils/jwt";

type Params = {
    name: string;
    avatar: string;
};

const server = async (params: Params, headers = {}) => {
    const token = Reflect.get(headers, "token");
    const session = decodeJWT(token);

    if (!session) {
        throw new Error("Not allowed");
    }

    const user = await prisma.user.update({
        where: { id: session.id },
        data: {
            name: params.name,
            avatar: params.avatar,
        },
    });

    return user;
};

const client: typeof server = (params) => {
    return fetch(target, params) as any;
};

const target = "POST /api/updateUser";

export { target, client, server };
