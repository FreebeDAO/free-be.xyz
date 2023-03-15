import { useState } from "react";

function UICSSWidget(
    props: JSX.IntrinsicElements["div"] & {
        css?: string;
    }
) {
    const { children, css, ...rest } = props;

    const [state, setState] = useState({
        cssReady: !css,
    });

    return (
        <>
            {css && (
                <link
                    rel="stylesheet"
                    href={css}
                    onLoad={() => {
                        setState({ cssReady: true });
                    }}
                />
            )}

            <div
                style={{
                    opacity: Number(state.cssReady),
                    transition: "opacity .3s",
                }}
                {...rest}
            >
                {children}
            </div>
        </>
    );
}

export { UICSSWidget };
