import { Upload } from "antd";
import { useState } from "react";
import { upload } from "../../services/tencent";
import { Props } from "./type";

function UIFileUpload({
    value = [],
    onChange,
    options = {
        resolvePath(file) {
            return file.name;
        },
    },
    children,
}: Props) {
    const [state, setState] = useState({
        fileList: value.filter(Boolean).map((file, index) => ({
            uid: `file-${index}`,
            name: file.split("/").at(-1) ?? file,
            url: file,
        })),
    });

    return (
        <Upload
            fileList={state.fileList}
            beforeUpload={async (file) => {
                const suffix = {
                    "image/jpeg": ".jpeg",
                    "image/png": ".png",
                }[file.type];

                if (!suffix) return false;

                let path = options.resolvePath?.(file) ?? "";
                if (path.startsWith("/")) path = path.slice(1);
                if (!path.endsWith("/")) path = path + "/";

                const name = path + Date.now() + suffix;
                const url = await upload({ name, file });
                if (!url) return false;

                setState((state) => {
                    const { fileList } = state;
                    return {
                        fileList: [
                            ...fileList,
                            {
                                uid: `file-${fileList.length}`,
                                name: file.name,
                                url,
                                status: "done",
                            },
                        ],
                    };
                });

                if (onChange) {
                    onChange([...value, url].filter(Boolean));
                }

                return false;
            }}
        >
            {children}
        </Upload>
    );
}

export { UIFileUpload };
