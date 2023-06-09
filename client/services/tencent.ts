import COS from "cos-js-sdk-v5";

const cos = new COS({
    SecretId: import.meta.env.COS_SECRET_ID,
    SecretKey: import.meta.env.COS_SECRET_KEY,
});

async function upload(params: { name: string; file: File }) {
    const response = await cos.putObject({
        Bucket: import.meta.env.COS_BUCKET_NAME,
        Region: import.meta.env.COS_BUCKET_REGION,
        Key: import.meta.env.COS_BUCKET_PREFIX + params.name,
        Body: params.file,
    });

    if (response.statusCode === 200) {
        return "https://" + response.Location;
    }

    return false;
}

export { upload };
