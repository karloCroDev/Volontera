// External packages
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";

// Lib
import { s3 } from "@/config/aws";
import { getKeyFromUrl } from "@/lib/aws-s3-functions";

export async function deleteImage(key: string) {
  const getKey = getKeyFromUrl(key);
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: getKey,
  });

  return s3.send(command);
}

export async function createUploadUrl({
  contentType,
  filename,
  size,
}: {
  filename: string;
  contentType: string;
  size: number;
}) {
  const key = `${uuid()}_${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
    ContentLength: size,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 300 });

  return { key, url };
}
