import { Button, Card, Form, Input } from "antd";
import { $registerUser } from "../../../server";
import { UICSSWidget } from "../../components/css-widget";
import { pushRoute } from "../../services/router";
import css from "./style.css?url";

/** 用户注册 */
function UserRegisterPage() {
    const saveHandler = (values: any) => {
        $registerUser({
            account: formatNameAsAccount(values.name),
            name: values.name,
        }).then((auth) => {
            if (auth) {
                sessionStorage.setItem("auth", JSON.stringify(auth));
                pushRoute(`/@${auth.account}`);
            }
        });
    };

    return (
        <UICSSWidget css={css}>
            <h1 className="title">Register</h1>

            <Card className="content">
                <Form layout="vertical" onFinish={saveHandler}>
                    <Form.Item
                        label="Your account name"
                        tooltip="This will be the name of your account on FreeBe."
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
                            Your URL will be:&nbsp;
                            {location.origin}
                            {import.meta.env.BASE_URL}
                            <Form.Item
                                noStyle
                                dependencies={["name"]}
                                children={(form) => {
                                    const value = form.getFieldValue("name");
                                    return (
                                        value && (
                                            <>
                                                <strong>
                                                    @
                                                    {formatNameAsAccount(value)}
                                                </strong>
                                                .
                                            </>
                                        )
                                    );
                                }}
                            />
                        </div>
                    </Form.Item>

                    <div className="footer">
                        <Button htmlType="submit" type="primary">
                            Next
                        </Button>
                    </div>
                </Form>
            </Card>
        </UICSSWidget>
    );
}

function formatNameAsAccount(name: string) {
    return name.replace(/\s+/g, "-").toLowerCase();
}

export { UserRegisterPage };
