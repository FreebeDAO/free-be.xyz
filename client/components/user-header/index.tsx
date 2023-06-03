import { Button, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { $getDao, $getUser } from "../../../server";
import { Entity, Nullable } from "../../../typings";
import logo from "../../assets/avatar.png";
import { popRoute, pushRoute } from "../../services/router";
import { UICSSWidget } from "../css-widget";
import css from "./style.css?url";

function UIUserHeader(props: { user: string; active: "daos" | "history" }) {
    const { user, active } = props;

    const [state, setState] = useState({
        user: null as Nullable<Entity.User>,
    });

    useEffect(() => {
        $getUser({ account: user }).then((user) => {
            if (user) {
                setState((state) => ({ ...state, user }));
                return;
            }

            message.error("can not access").then(popRoute);
        });
    }, []);

    if (!state.user) {
        return <Spin />;
    }

    const editHandler = () => {
        pushRoute(`/settings`);
    };

    const openDaosTab = () => {
        pushRoute(`/@${user}`, true);
    };

    const openHistoryTab = () => {
        pushRoute(`/@${user}/rewards`, true);
    };

    return (
        <UICSSWidget css={css}>
            <div className="header">
                <div className="header-cover" />

                <div className="header-content">
                    <div className="header-logo">
                        <img className="header-logo-image" src={logo} />
                    </div>

                    <div className="header-title">
                        <div className="header-title-name">
                            {state.user?.name}
                        </div>

                        <div className="header-title-account">@{user}</div>

                        {isCurrentUser(user) && (
                            <Button
                                className="header-title-edit"
                                onClick={editHandler}
                            >
                                edit
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="nav-tabs">
                <div
                    className={`nav-tab ${
                        active === "daos" ? "nav-tab-active" : ""
                    }`}
                    onClick={openDaosTab}
                >
                    My DAOs
                </div>

                <div
                    className={`nav-tab ${
                        active === "history" ? "nav-tab-active" : ""
                    }`}
                    onClick={openHistoryTab}
                >
                    History
                </div>
            </div>
        </UICSSWidget>
    );
}

function isCurrentUser(user: string) {
    if (sessionStorage.auth) {
        const auth = JSON.parse(sessionStorage.auth);
        return auth.account === user;
    }

    return false;
}

export { UIUserHeader };
