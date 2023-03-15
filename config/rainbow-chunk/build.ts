import { PluginOption } from "vite";

const setup = (): PluginOption => ({
    name: "rainbow-chunk-build",
    apply: "build",
    config() {
        return {
            build: {
                rollupOptions: {
                    output: {
                        manualChunks(id) {
                            const module = id.slice(process.cwd().length);

                            const valid = module.startsWith(
                                "/node_modules/@rainbow-me/"
                            );

                            if (valid) return "rainbow-chunk";
                        },
                    },
                },
            },
        };
    },
});

export { setup };
