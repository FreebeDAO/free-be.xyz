import { defineConfig } from "vite";

const config = defineConfig({
    build: {
        outDir: "dist/client",
    },

    plugins: require("./config").setup(),

    server: {
        host: "0.0.0.0",
        port: 4200,
        open: true,
    },
});

export default config;
