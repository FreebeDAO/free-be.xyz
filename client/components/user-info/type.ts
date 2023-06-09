import { ReactNode } from "react";
import { Entity } from "../../../typings";

type Props = {
    id: number;
    render: (user: Entity.User) => ReactNode;
};

export { Props };
