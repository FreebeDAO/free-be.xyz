import { UICSSWidget } from "../css-widget";
import css from "./style.css?url";

function UINotFound() {
    return (
        <UICSSWidget css={css}>
            <div className="title">404 Not Found</div>
        </UICSSWidget>
    );
}

export { UINotFound };
