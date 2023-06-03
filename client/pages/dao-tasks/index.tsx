import { Badge, Button, Input, Tag } from "antd";
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
                    <UIUserGuard
                        className="toolbar-create"
                        onClick={createHandler}
                        hidden={
                            !isCreator(state.dao ? state.dao.creator_id : -1)
                        }
                    >
                        + Create Task
                    </UIUserGuard>
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
                                <td>{task.reward}P</td>
                                <td>{pipeTaskCreator(task)}</td>
                                <td>{pipeTaskAssignee(task)}</td>
                                <td>{pipeTaskStatus(task)}</td>
                                <td>{pipeTaskProcess(task)}</td>
                                <td>Click To View</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </UICSSWidget>
    );
}

function isCreator(user_id: number) {
    if (sessionStorage.auth) {
        const auth = JSON.parse(sessionStorage.auth);
        return auth.id === user_id;
    }

    return false;
}

const pipeTaskCreator = (task: Entity.Task) => {
    if (task.creator) {
        return task.creator.name;
    }

    return "-";
};

const pipeTaskAssignee = (task: Entity.Task) => {
    if (task.assignee) {
        return `@${task.assignee.account}`;
    }

    return "-";
};

const pipeTaskStatus = (task: Entity.Task) => {
    const color = [, "magenta", "volcano", "gold", "lime"][task.status];

    const text = [, "created", "assigned", "reviewing", "finished"][
        task.status
    ];

    return <Badge color={color} text={text} />;
};

const pipeTaskProcess = (task: Entity.Task) => {
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
