import { prisma } from "../../../prisma";
import { fetch } from "../../utils/client";
import { decodeJWT, encodeJWT } from "../../utils/jwt";

type Params = {
    account: string;
    name: string;
};

const server = async (params: Params, headers = {}) => {
    const token = Reflect.get(headers, "token");
    const session = decodeJWT(token);

    const user = await prisma.user.create({
        data: {
            account: params.account,
            name: params.name,
            avatar: "",
        },
    });

    const wallet = await prisma.wallet.create({
        data: {
            address: session.address,
            user_id: user.id,
        },
    });

    const payload = {
        address: wallet.address,
        account: user.account,
        id: user.id,
    };

    return {
        ...payload,
        token: encodeJWT(payload),
    };
};

const client: typeof server = (params: Params) => {
    return fetch(target, params) as any;
};

const target = "POST /api/registerUser";

export { target, client, server };
