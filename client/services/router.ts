import { createBrowserHistory } from "history";
import { useEffect, useState } from "react";
import { matchRoutes } from "react-router";

const history = createBrowserHistory();

function pushRoute(target: string, replace = false) {
    if (target.startsWith("/")) {
        target = import.meta.env.BASE_URL.slice(0, -1) + target;
    }

    if (replace) {
        history.replace(target);
        return;
    }

    history.push(target);
}

function popRoute() {
    history.back();
}

function useRouter(
    routes: Record<string, { path: string; page: any }>,
    options: { pathname?: string } = {}
) {
    const [router, setRouter] = useState({
        location: history.location,
        action: history.action,
    });

    useEffect(() => {
        return history.listen(setRouter);
    }, []);

    const [target] =
        matchRoutes(
            Object.entries(routes).map(([key, value]) => ({
                ...value,
                name: key,
            })),
            options.pathname ?? location.pathname
        ) ?? [];

    return { routes, router, target } as const;
}

export { pushRoute, popRoute, useRouter };
