import { Modal, message } from "antd";
import { MouseEventHandler } from "react";
import { pushRoute } from "../../services/router";

function UIUserGuard(props: JSX.IntrinsicElements["div"]) {
    const clickHandler: MouseEventHandler<HTMLDivElement> = (event) => {
        if (sessionStorage.auth) {
            const auth = JSON.parse(sessionStorage.auth);
            if (auth.account) {
                if (props.onClick) {
                    props.onClick(event);
                }
                return;
            }

            Modal.confirm({
                title: "Not Allowed",
                content: "retry after register account",
                onOk() {
                    pushRoute("/register");
                },
                onCancel() {},
            });
            return;
        }

        message.warning("retry after connect wallet");
    };

    return <div {...props} onClick={clickHandler} />;
}

export { UIUserGuard };
