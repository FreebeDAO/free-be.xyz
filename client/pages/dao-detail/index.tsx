import { useEffect, useState } from "react";
import { $getDaoBasic } from "../../../server";
import { Entity } from "../../../typings";
import { UICSSWidget } from "../../components/css-widget";
import { UIDaoHeader } from "../../components/dao-header";
import { pushRoute } from "../../services/router";
import css from "./style.css?url";

/** 组织详情 */
function DaoDetailPage(props: { dao: string }) {
    const { dao } = props;

    const [state, setState] = useState({
        userList: [] as Entity.User[],
    });

    useEffect(() => {
        $getDaoBasic({ account: dao }).then((userList) => {
            setState({ userList });
        });
    }, []);

    const openUserHeadler = (user: Entity.User) => {
        pushRoute(`/@${user.account}`);
    };

    return (
        <UICSSWidget css={css}>
            <UIDaoHeader dao={dao} active="basic" />

            <div className="user-table">
                <table>
                    <thead className="user-table-head">
                        <tr>
                            <th>#</th>
                            <th>Contributor</th>
                            <th>Account</th>
                            <th>Shares</th>
                            <th>Reward</th>
                        </tr>
                    </thead>
                    <tbody className="user-table-body">
                        {state.userList.map((user, index) => (
                            <tr
                                key={index}
                                onClick={() => openUserHeadler(user)}
                            >
                                <td>{index + 1}</td>
                                <td>{user.name}</td>
                                <td>@{user.account}</td>
                                <td>{user.reward?.amount ?? 0}%</td>
                                <td>{user.reward?.percent ?? 0}P</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </UICSSWidget>
    );
}

export { DaoDetailPage };
