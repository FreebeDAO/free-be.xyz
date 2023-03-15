import { SiweMessage } from "siwe";
import { prisma } from "../../../../prisma";
import { fetch } from "../../../utils/client";
import { encodeJWT } from "../../../utils/jwt";

type Params = {
    message: SiweMessage;
    signature: string;
};

const server = async (params: Params) => {
    const siwe = await new SiweMessage(params.message).verify({
        signature: params.signature,
    });

    if (siwe.success) {
        const wallet = await prisma.wallet.findFirst({
            where: {
                address: siwe.data.address,
            },
        });

        if (wallet) {
            const user = await prisma.user.findFirst({
                where: { id: wallet.user_id },
            });

            if (user) {
                const payload = {
                    address: wallet.address,
                    account: user.account,
                    id: user.id,
                };

                return {
                    ...payload,
                    token: encodeJWT(payload),
                };
            }
        }

        const payload = {
            address: siwe.data.address,
        };

        return {
            ...payload,
            token: encodeJWT(payload),
        };
    }
};

const client: typeof server = (params: Params) => {
    return fetch(target, params) as any;
};

const target = "POST /api/verifyUserWallet";

export { target, client, server };
