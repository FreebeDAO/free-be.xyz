import { Button, Card, Form, Input, Spin, Upload, message } from "antd";
import { useEffect, useState } from "react";
import { $getDao, $updateDao } from "../../../server";
import { Entity, Nullable } from "../../../typings";
import { UICSSWidget } from "../../components/css-widget";
import { popRoute } from "../../services/router";
import css from "./style.css?url";

/** 组织设置 */
function DaoSettingsPage(props: { dao: string }) {
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

    const saveHandler = (values: any) => {
        $updateDao({
            ...state.dao,
            ...values,
        }).then(popRoute);
    };

    const daoURL =
        location.origin + import.meta.env.BASE_URL + state.dao.account;

    return (
        <UICSSWidget css={css}>
            <h1 className="title">
                DAO Settings
                <div className="title-float">{`{ ${dao} }`}</div>
            </h1>

            <Card className="content">
                <Form
                    layout="vertical"
                    initialValues={state.dao}
                    onFinish={saveHandler}
                >
                    <Form.Item label="DAO URL">
                        <a href={daoURL} target="_blank">
                            {daoURL}
                        </a>
                    </Form.Item>

                    <Form.Item
                        label="DAO display name"
                        name="name"
                        tooltip="This will be the name of your DAO on FreeBe."
                    >
                        <Input placeholder={"your name"} />
                    </Form.Item>

                    <Form.Item
                        label="DAO logo"
                        name="logo"
                        tooltip="Recommand size 240x240."
                    >
                        <Upload>
                            <Button>Upload</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="DAO mission"
                        name="mission"
                        tooltip="The way you are."
                    >
                        <Input.TextArea placeholder="your mission" />
                    </Form.Item>

                    <Form.Item
                        label="DAO color"
                        name="color"
                        tooltip="This is will be your theme color."
                    >
                        <Input type="color" />
                    </Form.Item>

                    <div className="footer">
                        <Button htmlType="submit" type="primary">
                            Save
                        </Button>
                    </div>
                </Form>
            </Card>
        </UICSSWidget>
    );
}

export { DaoSettingsPage };
