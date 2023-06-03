import { Badge, Button, Input, Spin, Tag } from "antd";
import { useEffect, useState } from "react";
import { $getDao, $getDaoTaskList } from "../../../server";
import { Entity, Nullable } from "../../../typings";
import { UICSSWidget } from "../../components/css-widget";
import { UIDaoHeader } from "../../components/dao-header";
import { UIUserGuard } from "../../components/user-guard";
import { pushRoute } from "../../services/router";
import css from "./style.css?url";

/** 任务列表 */
function DaoTasksPage(props: { dao: string }) {
    const { dao } = props;

    const [state, setState] = useState({
        dao: null as Nullable<Entity.Dao>,
        taskList: [] as Entity.Task[],
    });

    useEffect(() => {
        $getDao({ account: dao }).then((dao) => {
            setState((state) => ({ ...state, dao }));
        });

        $getDaoTaskList({ account: dao }).then((taskList) => {
            setState((state) => ({ ...state, taskList }));
        });
    }, []);

    if (!state.dao) {
        return <Spin />;
    }

    const createHandler = () => {
        pushRoute(`/${dao}/tasks/new`);
    };

    const openTaskHandler = (task: any) => {
        pushRoute(`/${dao}/tasks/${task.id}`);
    };

    return (
        <UICSSWidget css={css}>
            <UIDaoHeader dao={dao} active="tasks" />

            <div className="toolbar">
                <div className="toolbar-search">
                    <Input
                        className="toolbar-search-input"
                        placeholder="search task name"
                    />

                    <Button className="toolbar-search-button">search</Button>
                </div>

                <div className="toolbar-float">
                    {isCurrentCreator(state.dao.creator_id) && (
                        <UIUserGuard
                            className="toolbar-create"
                            onClick={createHandler}
                        >
                            + Create Task
                        </UIUserGuard>
                    )}
                </div>
            </div>

            <div className="task-table">
                <table>
                    <thead className="task-table-head">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Deadline</th>
                            <th>Reward</th>
                            <th>Creator</th>
                            <th>Assignee</th>
                            <th>Status</th>
                            <th>Progress</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="task-table-body">
                        {state.taskList.map((task, index) => (
                            <tr
                                key={index}
                                onClick={() => openTaskHandler(task)}
                            >
                                <td>{task.id}</td>
                                <td>{task.name}</td>
                                <td>{task.deadline}</td>
                                <td>{pipeReward(task)}</td>
                                <td>{pipeCreator(task)}</td>
                                <td>{pipeAssignee(task)}</td>
                                <td>{pipeStatus(task)}</td>
                                <td>{pipeProcess(task)}</td>
                                <td>Click To View</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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

const pipeReward = (task: Entity.Task) => {
    const num = task.reward ?? 0;

    return <Tag>{num} P</Tag>;
};

const pipeCreator = (task: Entity.Task) => {
    if (task.creator) {
        return task.creator.name;
    }

    return "-";
};

const pipeAssignee = (task: Entity.Task) => {
    if (task.assignee) {
        return `@${task.assignee.account}`;
    }

    return "-";
};

const pipeStatus = (task: Entity.Task) => {
    const target = [
        ,
        { text: "created", color: "magenta" },
        { text: "assigned", color: "volcano" },
        { text: "reviewing", color: "gold" },
        { text: "finished", color: "lime" },
    ][task.status];

    if (target) {
        return <Badge color={target.color} text={target.text} />;
    }

    return "-";
};

const pipeProcess = (task: Entity.Task) => {
    const ratio = task.key_results.length
        ? Math.floor(
              (task.key_results.filter((v) => v.checked).length /
                  task.key_results.length) *
                  100
          )
        : 0;

    return <Tag>{ratio}%</Tag>;
};

export { DaoTasksPage };
