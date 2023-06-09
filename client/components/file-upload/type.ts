import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
    value?: string[];
    onChange?: (value: string[]) => void;
    options?: {
        resolvePath?: (file: File) => string;
    };
}>;

export { Props };
