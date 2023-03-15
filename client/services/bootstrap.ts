import { type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { assertNonNullable } from "../utils/assert";

function mountVDom(vdom: ReactNode, container: Element | string) {
    if (typeof container === "string") {
        const element = document.querySelector(container);
        assertNonNullable(element);
        container = element;
    }

    const root = createRoot(container);
    root.render(vdom);
}

export { mountVDom };
