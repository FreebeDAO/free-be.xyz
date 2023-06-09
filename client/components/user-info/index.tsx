import { useEffect, useState } from "react";
import { $getUser } from "../../../server";
import { Entity, Nullable } from "../../../typings";
import { Props } from "./type";

function UIUserInfo({ id, render }: Props) {
    const [state, setState] = useState({
        user: null as Nullable<Entity.User>,
    });

    useEffect(() => {
        $getUser({ id }).then((user) => {
            setState({ user });
        });
    }, []);

    if (!state.user) return null;

    const children = render(state.user);

    return <>{children}</>;
}

export { UIUserInfo };
