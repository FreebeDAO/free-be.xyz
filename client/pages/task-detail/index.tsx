import {
    Button,
    Card,
    Checkbox,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Select,
    Space,
    Spin,
    Timeline,
    message,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { $getDaoTask, $getUserList, $updateDaoTask } from "../../../server";
import { Entity, Nullable } from "../../../typings";
import { UICSSWidget } from "../../components/css-widget";
import css from "./style.css?url";
import { popRoute } from "../../services/router";

/** 任务详情 */
function TaskDetailPage(props: { dao: string; task: string }) {
    const { dao, task } = props;

    const [state, setState] = useState({
        task: null as Nullable<Entity.Task>,
        userList: [] as Entity.User[],
    });

    useEffect(() => {
        $getUserList({}).then((userList) => {
            setState((state) => ({ ...state, userList }));
        });

        $getDaoTask({ dao, task }).then((task) => {
            setState((state) => ({ ...state, task }));
        });
    }, []);

    if (!state.task) {
        return <Spin />;
    }

    const permission = {
        get CAN_ASSIGN() {
            if (state.task && sessionStorage.auth) {
                if (state.task.status === 4) return false;

                const auth = JSON.parse(sessionStorage.auth);

                if (auth.id) {
                    if (
                        !state.task.assignee_id &&
                        state.task.creator_id !== auth.id
                    ) {
                        return true;
                    }
                }
            }

            return false;
        },

        get CAN_UPDATE() {
            if (state.task && sessionStorage.auth) {
                if (state.task.status === 4) return false;

                const auth = JSON.parse(sessionStorage.auth);

                if (auth.id) {
                    if (
                        state.task.creator_id === auth.id ||
                        state.task.assignee_id === auth.id
                    ) {
                        return true;
                    }
                }
            }

            return false;
        },

        get CAN_REVIEW() {
            if (state.task && sessionStorage.auth) {
                if (state.task.status === 4) return false;

                const auth = JSON.parse(sessionStorage.auth);

                if (auth.id) {
                    if (state.task.assignee_id === auth.id) {
                        return true;
                    }
                }
            }

            return false;
        },

        get CAN_APPROVE() {
            if (state.task && sessionStorage.auth) {
                if (state.task.status === 4) return false;

                const auth = JSON.parse(sessionStorage.auth);

                if (auth.id) {
                    if (state.task.creator_id === auth.id) {
                        return true;
                    }
                }
            }

            return false;
        },
    };

    const assignHandler = async () => {
        if (state.task) {
            return $updateDaoTask({
                scene: "assign",
                assign: {
                    id: state.task.id,
                    dao_id: state.task.dao_id,
                },
            });
        }
    };

    const updateHandler = async (values: any) => {
        if (state.task) {
            return $updateDaoTask({
                scene: "update",
                update: {
                    ...values,
                    deadline: values.deadline.format("YYYY-MM-DD"),
                    id: state.task.id,
                    dao_id: state.task.dao_id,
                },
            });
        }
    };

    const reviewHandler = async () => {
        if (state.task) {
            return $updateDaoTask({
                scene: "review",
                review: {
                    id: state.task.id,
                    dao_id: state.task.dao_id,
                },
            });
        }
    };

    const approveHandler = async () => {
        if (state.task) {
            await $updateDaoTask({
                scene: "approve",
                approve: {
                    id: state.task.id,
                    dao_id: state.task.dao_id,
                },
            });

            await message.success("success");

            popRoute();
        }
    };

    const createActionHandler = (handler: any, form: any) => async () => {
        const valid = await form.validateFields();

        if (valid) {
            const task = await handler(form.getFieldsValue());

            if (task) {
                message.success("task updated");

                $getDaoTask({ dao, task: task.id }).then((task) => {
                    setState((state) => ({ ...state, task }));
                });
            }
        }
    };

    return (
        <UICSSWidget css={css}>
            <h1 className="title">
                Task #{task}
                <div className="title-float">{`{ ${dao} }`}</div>
            </h1>

            <Card className="content">
                <Form
                    layout="vertical"
                    initialValues={{
                        ...state.task,
                        deadline: dayjs(state.task.deadline),
                    }}
                    style={{
                        pointerEvents: permission.CAN_UPDATE ? "auto" : "none",
                    }}
                >
                    <Form.Item
                        label="Task"
                        name="name"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="input name" />
                    </Form.Item>

                    <Form.Item
                        label="Deadline"
                        name="deadline"
                        rules={[{ required: true }]}
                    >
                        <DatePicker placeholder="select deadline" />
                    </Form.Item>

                    <Form.Item label="Reward" name="reward">
                        <InputNumber
                            placeholder="input reward"
                            addonAfter="P"
                            readOnly
                        />
                    </Form.Item>

                    <Form.Item label="Assignee" name="assignee_id">
                        <Select
                            options={state.userList.map((user) => ({
                                label: (
                                    <>
                                        {user.name}{" "}
                                        <small>@{user.account}</small>
                                    </>
                                ),
                                value: user.id,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Objective"
                        name="objective"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea
                            placeholder="input objective"
                            autoSize={{ minRows: 4 }}
                        />
                    </Form.Item>

                    <Form.List
                        name="key_results"
                        children={(fields, values) => (
                            <Form.Item
                                label={
                                    <Space>
                                        Key results
                                        {permission.CAN_UPDATE && (
                                            <a
                                                onClick={() =>
                                                    values.add({
                                                        checked: false,
                                                        content: "",
                                                    })
                                                }
                                            >
                                                + add
                                            </a>
                                        )}
                                    </Space>
                                }
                            >
                                <Space direction="vertical">
                                    {fields.map((field, index) => (
                                        <Space key={index}>
                                            <Form.Item
                                                {...field}
                                                noStyle
                                                key="checked"
                                                name={[index, "checked"]}
                                                valuePropName="checked"
                                            >
                                                <Checkbox />
                                            </Form.Item>

                                            <Form.Item
                                                {...field}
                                                noStyle
                                                key="content"
                                                name={[index, "content"]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: `'key results' #${
                                                            index + 1
                                                        } is required`,
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    placeholder="key result"
                                                    prefix={`#${index + 1}`}
                                                />
                                            </Form.Item>

                                            {index >=
                                                state.task!.key_results
                                                    .length && (
                                                <a
                                                    onClick={() =>
                                                        values.remove(index)
                                                    }
                                                >
                                                    delete
                                                </a>
                                            )}
                                        </Space>
                                    ))}
                                </Space>
                            </Form.Item>
                        )}
                    />

                    <Form.Item label="Activity">
                        <Timeline
                            style={{ marginTop: 12 }}
                            items={state.task.changes?.map((v) => ({
                                children: <>{v.log}</>,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        noStyle
                        shouldUpdate
                        children={(form) => (
                            <div className="footer">
                                <Button onClick={popRoute}>Back</Button>

                                {permission.CAN_ASSIGN && (
                                    <Button
                                        type="primary"
                                        onClick={createActionHandler(
                                            assignHandler,
                                            form
                                        )}
                                    >
                                        Request assign
                                    </Button>
                                )}

                                {permission.CAN_UPDATE && (
                                    <Button
                                        type="primary"
                                        onClick={createActionHandler(
                                            updateHandler,
                                            form
                                        )}
                                    >
                                        Update
                                    </Button>
                                )}

                                {permission.CAN_REVIEW && (
                                    <Button
                                        onClick={createActionHandler(
                                            reviewHandler,
                                            form
                                        )}
                                        disabled={Boolean(
                                            state.task?.key_results?.find(
                                                (v: any) => !v.checked
                                            )
                                        )}
                                    >
                                        Request review
                                    </Button>
                                )}

                                {permission.CAN_APPROVE && (
                                    <Button
                                        onClick={createActionHandler(
                                            approveHandler,
                                            form
                                        )}
                                        disabled={Boolean(
                                            state.task?.key_results?.find(
                                                (v: any) => !v.checked
                                            )
                                        )}
                                    >
                                        Approve
                                    </Button>
                                )}
                            </div>
                        )}
                    />
                </Form>
            </Card>
        </UICSSWidget>
    );
}

export { TaskDetailPage };
