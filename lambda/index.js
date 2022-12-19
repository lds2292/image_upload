const sharp = require("sharp");
const aws = require("aws-sdk");
const s3 = new aws.S3();

const transformationOptions = [
  { name: "w140", width: 140 },
  { name: "w600", width: 600 },
];

exports.handler = async (event) => {
  try {
    const Key = event.Records[0].s3.object.key;
    const KeyOnly = Key.split("/")[1];

    const image = await s3
      .getObject({
        Bucket: "browngoo-image-upload-tutorial",
        Key,
      })
      .promise();

    await Promise.all(
      transformationOptions.map(async ({ name, width }) => {
        const newKey = `${name}/${KeyOnly}`;
        const resizedImage = await sharp(image.Body)
          .rotate()
          .resize({ width, height: width, fit: "outside" })
          .toBuffer();
        await s3
          .putObject({
            Bucket: "browngoo-image-upload-tutorial",
            Body: resizedImage,
            Key: newKey,
          })
          .promise();
      })
    );

    return {
      statusCode: 200,
      body: event,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: event,
    };
  }
};
