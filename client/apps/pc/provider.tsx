import { Spin } from "antd";
import { Suspense, type ReactNode } from "react";

function Provider(props: { children: ReactNode }) {
    const { children } = props;

    return (
        // <StrictMode>
        <Suspense fallback={<Spin />}>{children}</Suspense>
        // </StrictMode>
    );
}

export { Provider };
