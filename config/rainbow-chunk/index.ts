import { PluginOption } from "vite";

const setup = (): PluginOption => [
    require("./build").setup(),
];

export { setup };
