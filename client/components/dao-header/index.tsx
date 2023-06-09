import { Button, Spin } from "antd";
import { useEffect, useState } from "react";
import { $getDao } from "../../../server";
import { Entity, Nullable } from "../../../typings";
import logo from "../../assets/avatar.png";
import { pushRoute } from "../../services/router";
import { UICSSWidget } from "../css-widget";
import css from "./style.css?url";

function UIDaoHeader(props: { dao: string; active: "basic" | "tasks" }) {
    const { dao, active } = props;

    const [state, setState] = useState({
        dao: null as Nullable<Entity.Dao>,
    });

    useEffect(() => {
        $getDao({ account: dao }).then((dao) => {
            setState({ dao });
        });
    }, []);

    if (!state.dao) {
        return <Spin />;
    }

    const editHandler = () => {
        pushRoute(`/${dao}/settings`);
    };

    const openBasicTab = () => {
        pushRoute(`/${dao}`, true);
    };

    const openTasksTab = () => {
        pushRoute(`/${dao}/tasks`, true);
    };

    return (
        <UICSSWidget css={css}>
            <div className="header">
                <div className="header-cover" />

                <div className="header-content">
                    <div
                        className="header-logo"
                        style={{ borderColor: state.dao.color }}
                    >
                        <img
                            className="header-logo-image"
                            src={state.dao.logo || logo}
                        />
                    </div>

                    <div className="header-title">
                        <div className="header-title-text">
                            {state.dao.name}
                        </div>

                        {isCurrentCreator(state.dao.creator_id) && (
                            <Button
                                className="header-title-edit"
                                onClick={editHandler}
                            >
                                edit
                            </Button>
                        )}
                    </div>

                    <div className="header-description">
                        {state.dao.mission}
                    </div>
                </div>
            </div>

            <div className="nav-tabs">
                <div
                    className={`nav-tab ${
                        active === "basic" ? "nav-tab-active" : ""
                    }`}
                    onClick={openBasicTab}
                >
                    basic
                </div>

                <div
                    className={`nav-tab ${
                        active === "tasks" ? "nav-tab-active" : ""
                    }`}
                    onClick={openTasksTab}
                >
                    tasks
                </div>
            </div>
        </UICSSWidget>
    );
}

function isCurrentCreator(creator: number) {
    if (sessionStorage.auth) {
        const auth = JSON.parse(sessionStorage.auth);
        return auth.id === creator;
    }

    return false;
}

export { UIDaoHeader };
