import { PluginOption } from "vite";

const setup = (): PluginOption => [
    require("./api-server").setup(),
    require("./rainbow-chunk").setup(),
    require("./react").setup(),
    require("./siwe-patch").setup(),
];

export { setup };
