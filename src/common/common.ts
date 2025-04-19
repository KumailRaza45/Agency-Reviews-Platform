import AWS from "aws-sdk";
const S3_BUCKET_NAME = "agencyreviews-dev";
const REGION = "us-east-1";
const ACCESS_KEY = "AKIA3OLPCL6JXNDCAPXD";
const SECRET_ACCESS_KEY = "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";

export async function handleFileUploadCommon(file) {
  if (
    file &&
    !["image/svg+xml", "image/png", "image/jpeg", "application/pdf"].includes(file.type)
  ) {
    console.log("Only SVG, PNG, and JPG files are allowed.");
    return { Location: "" };
  } else {
    try {
      AWS.config.update({
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_ACCESS_KEY,
        region: REGION,
      });
      const s3 = new AWS.S3();
      console.log("Key: " + file?.name);
      const params: AWS.S3.PutObjectRequest = {
        Bucket: S3_BUCKET_NAME,
        // selectedFile?.selectedFile
        Key: file.name,
        ContentType: file.type,
        Body: file,
        // ACL: 'public-read', // If you want the uploaded image to be publicly accessible
      };

      const uploadPromise = s3.upload(params).promise();
      const data = await uploadPromise;
      return data;
    } catch (error) {
      console.error("Error uploading image:", error);
      return { Location: "" };
    }
  }
}
