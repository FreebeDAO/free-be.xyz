import { useEffect, useState } from "react";
import { $getDaoList } from "../../../server";
import { Entity } from "../../../typings";
import { UICSSWidget } from "../../components/css-widget";
import { UIDaoCard } from "../../components/dao-card";
import { UIUserHeader } from "../../components/user-header";
import css from "./style.css?url";

/** 用户详情 */
function UserHomePage(props: { user: string }) {
    const { user } = props;

    const [state, setState] = useState({
        daoList: [] as Entity.Dao[],
    });

    useEffect(() => {
        $getDaoList({ creator: user }).then((daoList) => {
            setState((state) => ({ ...state, daoList }));
        });
    }, []);

    return (
        <UICSSWidget css={css}>
            <UIUserHeader user={user} active="daos" />

            <div className="dao-list">
                {state.daoList.map((dao, index) => (
                    <UIDaoCard key={index} dao={dao} />
                ))}
            </div>
        </UICSSWidget>
    );
}

export { UserHomePage };
