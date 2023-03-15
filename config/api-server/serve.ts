import { exec } from "child_process";
import { PluginOption } from "vite";

const setup = (): PluginOption => {
    const setup = require("../../server/setup").default;

    return {
        name: "api-server-serve",
        apply: "serve",
        configureServer(server) {
            exec(`prisma studio --port 5555 --browser none`);
            server.middlewares.use("/api/", setup);
        },
        configurePreviewServer(server) {
            server.middlewares.use("/api/", setup);
        },
    };
};

export { setup };
