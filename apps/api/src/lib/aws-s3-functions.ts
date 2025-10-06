import { s3 } from "@/src/config/aws";
import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getImagePresignedUrls(image: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: image,
    });

    return getSignedUrl(s3, command, { expiresIn: 3600 });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
}

export function getKeyFromUrl(url: string): string {
  const urlObj = new URL(url);
  return decodeURIComponent(urlObj.pathname.substring(1));
}
