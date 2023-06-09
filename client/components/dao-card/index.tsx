import { Entity } from "../../../typings";
import logo from "../../assets/avatar.png";
import { pushRoute } from "../../services/router";
import { UICSSWidget } from "../css-widget";
import css from "./style.css?url";

function UIDaoCard(props: { dao: Entity.Dao }) {
    const { dao } = props;

    const openHandler = () => {
        pushRoute(`/${dao.account}`);
    };

    return (
        <UICSSWidget css={css}>
            <div className="dao-card" onClick={openHandler}>
                <div className="dao-card-header">
                    <div className="dao-avatar">
                        <img src={dao.logo || logo} />
                    </div>
                    <div className="dao-title">{dao.name}</div>
                    {/* <div className="dao-account">{`{ ${dao.account} }`}</div> */}
                </div>
                <div className="dao-card-body">
                    <div className="dao-mission">{dao.mission}</div>
                </div>
            </div>
        </UICSSWidget>
    );
}

export { UIDaoCard };
