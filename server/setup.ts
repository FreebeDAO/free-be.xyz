import { Connect } from "vite";
import { APP_ROUTES } from "./constants/app";

const setup: Connect.NextHandleFunction = async (req, res, next) => {
    const { url, method, headers } = req;

    if (url && method) {
        const path = url.replace(/\?.*/, "");

        if (/\.tsx?$/.test(path)) {
            next();
            return;
        }

        const route = APP_ROUTES.find(
            (r) => r.target === `${method} /api${path}`
        );

        if (route) {
            const request = () => {
                if (method === "GET") {
                    const s = new URL(`http://${headers.host}${url}`);
                    return Object.fromEntries(s.searchParams.entries());
                }

                if (method === "POST") {
                    return new Promise((resolve) => {
                        req.once("readable", () => {
                            req.setEncoding("utf-8");
                            resolve(JSON.parse(req.read()));
                        });
                    });
                }
            };

            const response = (data: any) => {
                if (res.writableEnded) {
                    return;
                }

                if (
                    typeof data === "string" ||
                    typeof data === "number" ||
                    typeof data === "boolean"
                ) {
                    res.end(String(data));
                    return;
                }

                if (typeof data === "object") {
                    if (data instanceof Promise) {
                        data.then(response, response);
                        return;
                    }

                    if (data instanceof Error) {
                        res.writeHead(500);
                        res.end(data.message);
                        return;
                    }

                    res.end(JSON.stringify(data));
                    return;
                }
            };

            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            response(route.server(await request(), req.headers));

            return;
        }
    }

    res.end("404 Not Found");
};

export default setup;
