import { Button, Upload } from "antd";
import COS from "cos-js-sdk-v5";

/** 用户设置 */
function UserSettingsPage() {
    const cos = new COS({
        SecretId: "AKIDgLtOG1hV7kYJvVwJNHMUyNn6Phs6HUr5",
        SecretKey: "DaVH2lFXbSEqHg7RcdS6Yu41qXAe9pOl",
    });

    return (
        <>
            user setting
            <Upload
                beforeUpload={(file) => {
                    cos.putObject({
                        Bucket: "free-be-1256742492",
                        Region: "ap-beijing",
                        Key: "/" + file.name,
                        Body: file,
                    });

                    return false;
                }}
            >
                <Button>upload</Button>
            </Upload>
        </>
    );
}

export { UserSettingsPage };
