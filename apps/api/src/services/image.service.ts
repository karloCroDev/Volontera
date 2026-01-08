// Lib
import { getImagePresignedUrls } from "@/lib/aws-s3-functions";
import { Image } from "@google/genai";

// Schemas
import { ImageKeysSchemaArgs } from "@repo/schemas/image";

export async function getImageFromKeyService({
  imageUrls,
}: ImageKeysSchemaArgs) {
  const uniqueKeys = [...new Set(imageUrls)];

  const urls: Record<string, string> = {};

  await Promise.all(
    uniqueKeys.map(
      async (key) => (urls[key] = await getImagePresignedUrls(key))
    )
  );

  return {
    status: 200,
    body: {
      title: "Image URLs",
      message: "Successfuly get image url from the keys",
      urls,
    },
  };
}
