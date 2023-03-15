import { UINotFound } from "../../components/not-found";
import { APP_ROUTES } from "../../constants/app";
import { useRouter } from "../../services/router";
import { Layout } from "./layout";
import { Provider } from "./provider";
import "./style.css";

function PCApp() {
    const { target } = useRouter(APP_ROUTES, {
        get pathname() {
            const pathname =
                "/" + location.pathname.slice(import.meta.env.BASE_URL.length);

            if (pathname.startsWith("/@")) {
                return pathname.replace("@", "user/");
            }

            return pathname;
        },
    });

    if (target) {
        const { route, params } = target;
        document.title = route.name;

        return (
            <Provider>
                <Layout>
                    <route.page {...params} />
                </Layout>
            </Provider>
        );
    }

    return <UINotFound />;
}

export { PCApp };
