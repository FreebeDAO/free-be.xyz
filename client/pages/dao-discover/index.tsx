import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { $getDaoList } from "../../../server";
import { Entity } from "../../../typings";
import { UICSSWidget } from "../../components/css-widget";
import { UIDaoCard } from "../../components/dao-card";
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
                        onPressEnter={searchHandler}
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
                    <UIDaoCard key={index} dao={dao} />
                ))}
            </div>
        </UICSSWidget>
    );
}

export { DaoDiscoverPage };
