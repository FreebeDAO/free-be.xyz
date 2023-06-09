import {
    Button,
    Card,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Space,
    Spin,
    message,
} from "antd";
import { useEffect, useState } from "react";
import { $createDaoTask, $getDao } from "../../../server";
import { Entity, Nullable } from "../../../typings";
import { UICSSWidget } from "../../components/css-widget";
import { popRoute } from "../../services/router";
import css from "./style.css?url";

/** 创建任务 */
function CreateTaskPage(props: { dao: string }) {
    const { dao } = props;

    const [state, setState] = useState({
        dao: null as Nullable<Entity.Dao>,
    });

    useEffect(() => {
        $getDao({ account: dao }).then((dao) => {
            if (dao && sessionStorage.auth) {
                const auth = JSON.parse(sessionStorage.auth);
                if (auth.id === dao.creator_id) {
                    setState({ dao });
                    return;
                }
            }

            message.error("can not access").then(popRoute);
        });
    }, []);

    if (!state.dao) {
        return <Spin />;
    }

    const createHandler = (values: any) => {
        if (state.dao) {
            $createDaoTask({
                ...values,
                deadline: values.deadline.format("YYYY-MM-DD"),
                dao_id: state.dao.id,
            }).then(popRoute);
        }
    };

    return (
        <UICSSWidget css={css}>
            <h1 className="title">
                Create Task
                <div className="title-float">{`{ ${dao} }`}</div>
            </h1>

            <Card className="content">
                <Form layout="vertical" onFinish={createHandler}>
                    <div className="toolbar">
                        <Button onClick={popRoute}>Back</Button>

                        <Button htmlType="submit" type="primary">
                            Create
                        </Button>
                    </div>

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

                    <Form.Item
                        label="Reward"
                        name="reward"
                        rules={[{ required: true }]}
                    >
                        <InputNumber
                            placeholder="input reward"
                            addonAfter="P"
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
                        initialValue={[]}
                        children={(fields, values) => (
                            <Form.Item
                                label={
                                    <Space>
                                        Key results
                                        <a onClick={() => values.add("")}>
                                            + add
                                        </a>
                                    </Space>
                                }
                            >
                                <Space direction="vertical">
                                    {fields.map((field, index) => (
                                        <Space key={index}>
                                            <Form.Item
                                                noStyle
                                                {...field}
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
                                            <a
                                                onClick={() =>
                                                    values.remove(index)
                                                }
                                            >
                                                delete
                                            </a>
                                        </Space>
                                    ))}
                                </Space>
                            </Form.Item>
                        )}
                    />
                </Form>
            </Card>
        </UICSSWidget>
    );
}

export { CreateTaskPage };
