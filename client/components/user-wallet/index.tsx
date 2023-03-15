import { UICSSWidget } from "../css-widget";
import { Rainbow } from "./rainbow";
import css from "./style.css?url";

function UIUserWallet() {
    return (
        <UICSSWidget css={css} className="ui-wallet">
            <Rainbow />
        </UICSSWidget>
    );
}

export { UIUserWallet };
