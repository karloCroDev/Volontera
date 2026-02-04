// External packages
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";

// Config
import { s3 } from "@/config/aws";

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

export async function getImagePresignedUrls(image: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: image,
    });

    return await getSignedUrl(s3, command, { expiresIn: 3600 });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
}

export function getKeyFromUrl(url: string): string {
  const urlObj = new URL(url);
  return decodeURIComponent(urlObj.pathname.substring(1));
}

export async function deleteImage(key: string) {
  const getKey = getKeyFromUrl(key);
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: getKey,
  });

  return s3.send(command);
}
