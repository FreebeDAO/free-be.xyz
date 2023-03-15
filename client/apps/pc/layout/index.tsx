import { message } from "antd";
import { type ReactNode } from "react";
import logo from "../../../assets/logo.png";
import { UICSSWidget } from "../../../components/css-widget";
import { UIUserGuard } from "../../../components/user-guard";
import { UIUserWallet } from "../../../components/user-wallet";
import { pushRoute } from "../../../services/router";
import css from "./style.css?url";

function Layout(props: { children: ReactNode }) {
    const { children } = props;

    const pure = ["/new", "/register"].includes(location.pathname);
    if (pure) {
        return <>{children}</>;
    }

    return (
        <UICSSWidget css={css}>
            <div className="topbar">
                <div
                    className="topbar-logo"
                    onClick={() => {
                        pushRoute("/");
                    }}
                >
                    <img className="topbar-logo-image" src={logo} />
                </div>

                <div className="topbar-menu">
                    <UIUserGuard
                        className="topbar-menu-item"
                        onClick={() => {
                            const auth = JSON.parse(sessionStorage.auth);
                            pushRoute(`/@${auth.account}`);
                        }}
                    >
                        My DAOs
                    </UIUserGuard>
                    <div
                        hidden
                        className="topbar-menu-item"
                        onClick={() => {
                            message.warning("coming soon");
                        }}
                    >
                        Notifications
                    </div>
                    <div
                        className="topbar-menu-item"
                        onClick={() => {
                            window.open("https://free-be.xyz/", "_blank");
                        }}
                    >
                        About Us
                    </div>
                </div>

                <div className="topbar-float">
                    <UIUserWallet />
                </div>
            </div>

            {children}

            <footer>&copy; {location.hostname}</footer>
        </UICSSWidget>
    );
}

export { Layout };
