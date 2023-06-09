import { Button, Card, Form, Input, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { $getUser, $updateUser } from "../../../server";
import { Entity, Nullable } from "../../../typings";
import { UICSSWidget } from "../../components/css-widget";
import { UIFileUpload } from "../../components/file-upload";
import { popRoute } from "../../services/router";
import css from "./style.css?url";

/** 用户设置 */
function UserSettingsPage() {
    const [state, setState] = useState({
        user: null as Nullable<Entity.User>,
    });

    useEffect(() => {
        if (sessionStorage.auth) {
            const auth = JSON.parse(sessionStorage.auth);

            $getUser({ account: auth.account }).then((user) => {
                setState({ user });
            });

            return;
        }

        message.error("can not access").then(popRoute);
    }, []);

    if (!state.user) {
        return <Spin />;
    }

    const saveHandler = (values: any) => {
        $updateUser({
            ...state.user,
            ...values,
            avatar: values.avatar[0],
        }).then(popRoute);
    };

    const userURL =
        location.origin + import.meta.env.BASE_URL + "@" + state.user.account;

    return (
        <UICSSWidget css={css}>
            <h1 className="title">User Setting</h1>

            <Card className="content">
                <Form
                    layout="vertical"
                    initialValues={{
                        ...state.user,
                        avatar: [],
                    }}
                    onFinish={saveHandler}
                >
                    <Form.Item label="Your URL">
                        <a href={userURL} target="_blank">
                            {userURL}
                        </a>
                    </Form.Item>

                    <Form.Item
                        label="Your display name"
                        name="name"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder={state.user.name} />
                    </Form.Item>

                    <Form.Item label="Your avatar" name="avatar">
                        <UIFileUpload>
                            <Button>Upload</Button>
                        </UIFileUpload>
                    </Form.Item>

                    <div className="footer">
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </div>
                </Form>
            </Card>
        </UICSSWidget>
    );
}

export { UserSettingsPage };
