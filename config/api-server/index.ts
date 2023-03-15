import { PluginOption } from "vite";

const setup = (): PluginOption => [
    require("./serve").setup(),
    require("./build").setup(),

    {
        name: "api-server",
        config() {
            return {
                preview: {
                    host: "0.0.0.0",
                    port: 4201,
                    strictPort: true,
                    open: false,
                    cors: false,
                },
            };
        },
    },
];

export { setup };
