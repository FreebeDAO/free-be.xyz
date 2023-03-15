import { prisma } from "../../../prisma";
import { fetch } from "../../utils/client";

type Params = {};

const server = async (params: Params) => {
    const userList = await prisma.user.findMany();

    return userList;
};

const client: typeof server = (params) => {
    return fetch(target, params) as any;
};

const target = "GET /api/getUserList";

export { target, client, server };
