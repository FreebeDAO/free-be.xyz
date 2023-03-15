import { sign, verify } from "jsonwebtoken";

function encodeJWT(payload: any) {
    return sign(payload, process.env.JWT_SECRET);
}

function decodeJWT(payload: any) {
    return verify(payload, process.env.JWT_SECRET) as any;
}

export { encodeJWT, decodeJWT };
