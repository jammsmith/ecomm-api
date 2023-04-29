exports = async () => {
  const bucketName = context.values.get('S3_BUCKET');
  const region = context.values.get('S3_REGION');
  const accessKeyId = context.values.get('S3_ACCESS_KEY');
  const secretAccessKey = context.values.get('S3_SECRET_ACCESS_KEY');

  return {
    bucketName,
    region,
    accessKeyId,
    secretAccessKey
  };
};
