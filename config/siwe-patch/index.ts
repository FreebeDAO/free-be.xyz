import { PluginOption } from "vite";

const setup = (): PluginOption => [
    require("./serve").setup(),
    require("./build").setup(),
];

export { setup };
