import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import { PluginOption } from "vite";

const setup = (): PluginOption => ({
    name: "siwe-patch-serve",
    apply: "serve",
    config() {
        return {
            optimizeDeps: {
                esbuildOptions: {
                    plugins: [
                        NodeModulesPolyfillPlugin(),
                        NodeGlobalsPolyfillPlugin({
                            buffer: true,
                        }),
                    ],
                },
            },
        };
    },
});

export { setup };
