import { Button, Card, Form, Input, Upload } from "antd";
import { useState } from "react";
import { $createDao } from "../../../server";
import { UICSSWidget } from "../../components/css-widget";
import { pushRoute } from "../../services/router";
import css from "./style.css?url";

/** 创建组织 */
function CreateDaoPage() {
    const [state, setState] = useState({
        step: 0,
        name: "",
        logo: "",
        mission: "",
        color: "",
    });

    const [form] = Form.useForm();

    const nextHandler = () => {
        setState((state) => ({
            ...state,
            step: 1,
        }));
    };

    const prevHandler = () => {
        setState((state) => ({
            ...state,
            step: 0,
        }));
    };

    const startHandler = () => {
        $createDao({
            account: formatNameAsAccount(state.name),
            name: state.name,
            logo: state.logo,
            mission: state.mission,
            color: state.color,
        }).then((dao) => {
            pushRoute(`/${dao.account}`);
        });
    };

    return (
        <UICSSWidget css={css}>
            <h1 className="title">Create DAO</h1>

            {state.step === 0 && (
                <Card className="content">
                    <Form
                        layout="vertical"
                        form={form}
                        onValuesChange={(values) => {
                            setState((state) => ({
                                ...state,
                                ...values,
                            }));
                        }}
                        onFinish={nextHandler}
                    >
                        <Form.Item
                            label="DAO account name"
                            tooltip="This will be the name of your DAO on FreeBe."
                            required
                        >
                            <Form.Item
                                noStyle
                                name="name"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item>

                            <div style={{ marginTop: 4 }}>
                                Your DAO URL will be:&nbsp;
                                {location.origin}
                                {import.meta.env.BASE_URL}
                                {state.name && (
                                    <>
                                        <strong>
                                            {formatNameAsAccount(state.name)}
                                        </strong>
                                        .
                                    </>
                                )}
                            </div>
                        </Form.Item>

                        <div className="footer">
                            <Button htmlType="submit" type="primary">
                                Next
                            </Button>
                        </div>
                    </Form>
                </Card>
            )}

            {state.step === 1 && (
                <Card className="content">
                    <Form
                        layout="vertical"
                        form={form}
                        onValuesChange={(values) => {
                            setState((state) => ({
                                ...state,
                                ...values,
                            }));
                        }}
                        onFinish={startHandler}
                    >
                        <Form.Item
                            label="DAO logo"
                            name="logo"
                            tooltip="Recommand size 240x240."
                            rules={[{ required: false }]}
                        >
                            <Upload>
                                <Button>Upload</Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item
                            label="DAO mission"
                            name="mission"
                            tooltip="The way you are."
                            rules={[{ required: true }]}
                        >
                            <Input.TextArea placeholder="Your mission" />
                        </Form.Item>

                        <Form.Item
                            label="DAO color"
                            name="color"
                            tooltip="This is will be your theme color."
                            rules={[{ required: true }]}
                        >
                            <Input type="color" />
                        </Form.Item>

                        <div className="footer">
                            <Button onClick={prevHandler}>Back</Button>
                            <Button htmlType="submit" type="primary">
                                Create
                            </Button>
                        </div>
                    </Form>
                </Card>
            )}
        </UICSSWidget>
    );
}

function formatNameAsAccount(name: string) {
    return name.replace(/\s+/g, "-").toLowerCase();
}

export { CreateDaoPage };
