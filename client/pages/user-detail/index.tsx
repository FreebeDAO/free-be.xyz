import { Button, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { $getDaoList, $getUser } from "../../../server";
import { Entity, Nullable } from "../../../typings";
import logo from "../../assets/avatar.png";
import { UICSSWidget } from "../../components/css-widget";
import { UIDaoCard } from "../../components/dao-card";
import { popRoute, pushRoute } from "../../services/router";
import css from "./style.css?url";

/** 用户详情 */
function UserDetailPage(props: { user: string }) {
    const { user } = props;

    const [state, setState] = useState({
        user: null as Nullable<Entity.User>,
        daoList: [] as Entity.Dao[],
    });

    useEffect(() => {
        $getUser({ account: user }).then((user) => {
            if (user) {
                setState((state) => ({ ...state, user }));
                return;
            }

            message.error("can not access").then(popRoute);
        });

        $getDaoList({ creator: user }).then((daoList) => {
            setState((state) => ({ ...state, daoList }));
        });
    }, []);

    if (!state.user) {
        return <Spin />;
    }

    const editHandler = () => {
        pushRoute("/settings");
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
                <div className="nav-tab nav-tab-active">My DAOs</div>
                <div
                    className="nav-tab"
                    onClick={() => {
                        message.warning("coming soon");
                    }}
                >
                    History
                </div>
            </div>

            <div className="dao-list">
                {state.daoList.map((dao, index) => (
                    <UIDaoCard key={index} dao={dao} />
                ))}
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

export { UserDetailPage };
