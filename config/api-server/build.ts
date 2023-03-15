import generator from "@babel/generator";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { Identifier } from "@babel/types";
import { PluginOption } from "vite";

const setup = (): PluginOption => ({
    name: "api-server-build",
    apply: "build",
    transform(code, id) {
        const module = id.slice(process.cwd().length);

        if (module.startsWith("/server/controllers/")) {
            const ast = parse(code, { sourceType: "module" });

            traverse(ast, {
                enter(path) {
                    if (path.parent.type === "Program") {
                        if (path.isImportDeclaration()) {
                            const importPath = path.node.source.value;

                            const valid =
                                importPath.endsWith("../utils/client");

                            if (valid) return;
                        }

                        if (path.isVariableDeclaration()) {
                            const variableName = (
                                path.node.declarations[0].id as Identifier
                            ).name;

                            const valid =
                                variableName === "client" ||
                                variableName === "target";

                            if (valid) return;
                        }

                        if (path.isExportNamedDeclaration()) {
                            return;
                        }

                        path.remove();
                        path.skip();
                        return;
                    }

                    if (path.isExportSpecifier()) {
                        const exportName = (path.node.exported as Identifier)
                            .name;

                        const valid = exportName === "client";

                        if (!valid) {
                            path.remove();
                            path.skip();
                            return;
                        }
                    }
                },
            });

            return generator(ast);
        }

        return { code, map: null };
    },
});

export { setup };
