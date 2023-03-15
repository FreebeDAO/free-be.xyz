import react from "@vitejs/plugin-react";
import { PluginOption } from "vite";
import { babel } from "./babel";

const setup = (): PluginOption => [
    react({
        babel,
    }),
];

export { setup };
