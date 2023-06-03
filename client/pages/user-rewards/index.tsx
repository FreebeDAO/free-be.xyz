import { useEffect, useState } from "react";
import { $getUserRewardList } from "../../../server";
import { Entity } from "../../../typings";
import { UICSSWidget } from "../../components/css-widget";
import { UIUserHeader } from "../../components/user-header";
import css from "./style.css?url";
import { Badge, Tag } from "antd";

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
                    <thead className="reward-table-head">
                        <tr>
                            <th>#</th>
                            <th>Task</th>
                            <th>Reward</th>
                            <th>Dao</th>
                            <th>Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody className="reward-table-body">
                        {state.rewardList.map((reward, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{reward.task?.name}</td>
                                <td>{pipeReward(reward)}</td>
                                <td>{reward.dao?.name}</td>
                                <td>{pipeTime(reward)}</td>
                                <td>{pipeStatus(reward)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </UICSSWidget>
    );
}

const pipeReward = (reward: Entity.Reward) => {
    const num = reward.reward ?? 0;

    return <Tag>{num} P</Tag>;
};

const pipeTime = (reward: Entity.Reward) => {
    if (reward.status === 1) {
        return reward.created_at ?? "-";
    }

    if (reward.status === 2) {
        return reward.updated_at ?? "-";
    }

    return "-";
};

const pipeStatus = (reward: Entity.Reward) => {
    const target = [
        ,
        { text: "created", color: "red" },
        { text: "approved", color: "green" },
    ][reward.status];

    if (target) {
        return <Badge color={target.color} text={target.text} />;
    }

    return "-";
};

export { UserRewardsPage };
