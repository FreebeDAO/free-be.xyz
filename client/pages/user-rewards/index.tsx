import { useEffect, useState } from "react";
import { $getUserRewardList } from "../../../server";
import { Entity } from "../../../typings";
import { UICSSWidget } from "../../components/css-widget";
import { UIUserHeader } from "../../components/user-header";
import css from "./style.css?url";

/** 用户奖励 */
function UserRewardsPage(props: { user: string }) {
    const { user } = props;

    const [state, setState] = useState({
        rewardList: [] as Entity.Reward[],
    });

    useEffect(() => {
        $getUserRewardList({ account: user }).then((rewardList) => {
            setState((state) => ({ ...state, rewardList }));
        });
    }, []);

    return (
        <UICSSWidget css={css}>
            <UIUserHeader user={user} active="history" />

            <div className="reward-table">
                <table>
                    <thead className="user-table-head">
                        <tr>
                            <th>#</th>
                            <th>Task</th>
                            <th>Reward</th>
                            <th>Dao</th>
                            <th>Create</th>
                            <th>Update</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody className="user-table-body">
                        {state.rewardList.map((reward, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{reward.task?.name}</td>
                                <td>{reward.reward ?? 0}P</td>
                                <td>{reward.dao?.name}</td>
                                <td>{reward.created_at ?? "-"}</td>
                                <td>{reward.updated_at ?? "-"}</td>
                                <td>
                                    {Reflect.get(
                                        { 1: "created", 2: "approved" },
                                        reward.status
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </UICSSWidget>
    );
}

export { UserRewardsPage };
