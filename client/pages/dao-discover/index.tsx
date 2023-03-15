import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { $getDaoList } from "../../../server";
import { Entity } from "../../../typings";
import { UICSSWidget } from "../../components/css-widget";
import { UIUserGuard } from "../../components/user-guard";
import { pushRoute } from "../../services/router";
import css from "./style.css?url";

/** 发现广场 */
function DaoDiscoverPage() {
    const [state, setState] = useState({
        daoList: [] as Entity.Dao[],
        search: "",
    });

    const searchHandler = async () => {
        $getDaoList({
            search: state.search,
        }).then((daoList) => {
            setState((state) => ({ ...state, daoList }));
        });
    };

    const createHandler = () => {
        pushRoute("/new");
    };

    const openHandler = (dao: Entity.Dao) => {
        pushRoute(`/${dao.account}`);
    };

    useEffect(() => {
        searchHandler();
    }, []);

    return (
        <UICSSWidget css={css}>
            <div className="title">
                <strong>
                    <span>Onboard</span>ing
                </strong>
                fabulous DAOs throughout the world!
            </div>

            <div className="toolbar">
                <div className="toolbar-search">
                    <Input
                        className="toolbar-search-input"
                        placeholder="search dao name"
                        value={state.search}
                        onChange={(event) => {
                            setState((state) => ({
                                ...state,
                                search: event.target.value,
                            }));
                        }}
                    />

                    <Button
                        className="toolbar-search-button"
                        onClick={searchHandler}
                    >
                        search
                    </Button>
                </div>

                <div className="toolbar-float">
                    <UIUserGuard
                        className="toolbar-create"
                        onClick={createHandler}
                    >
                        + Create DAO
                    </UIUserGuard>
                </div>
            </div>

            <div className="dao-list">
                {state.daoList.map((dao, index) => (
                    <div
                        key={index}
                        className="dao-card"
                        onClick={() => openHandler(dao)}
                    >
                        <div className="dao-card-header">
                            <div className="dao-avatar">
                                <img src={dao.logo} />
                            </div>
                            <div className="dao-title">{dao.name}</div>
                            <div className="dao-account">
                                {`{ ${dao.account} }`}
                            </div>
                        </div>
                        <div className="dao-card-body">
                            <div className="dao-mission">{dao.mission}</div>
                        </div>
                    </div>
                ))}
            </div>
        </UICSSWidget>
    );
}

export { DaoDiscoverPage };
