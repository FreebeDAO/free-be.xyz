import inject from "@rollup/plugin-inject";
import { PluginOption } from "vite";

const setup = (): PluginOption => ({
    name: "siwe-patch-build",
    apply: "build",
    config() {
        return {
            build: {
                rollupOptions: {
                    plugins: [
                        inject({
                            Buffer: ["buffer", "Buffer"],
                        }),
                    ],
                },
            },
        };
    },
    transform(code, id) {
        const files = {
            "apg-js/src/apg-conv-api/transformers.js"() {
                return {
                    code: code.replace(/thisThis\.utf16le/g, "exports.utf16le"),
                };
            },
        };

        for (const [key, handler] of Object.entries(files)) {
            if (id === require.resolve(key)) {
                return handler();
            }
        }

        return { code, map: null };
    },
});

export { setup };
