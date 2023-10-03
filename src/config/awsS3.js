import { S3Client } from "@aws-sdk/client-s3";

export default new S3Client(
  {
          region: process.env.REACT_APP_AWS_S3_REGION,
          credentials:{
            accessKeyId:process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey:process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
          }
  });