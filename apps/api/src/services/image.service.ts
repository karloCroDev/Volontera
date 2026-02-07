// Lib
import { createUploadUrl, getImagePresignedUrls } from "@/lib/aws-s3-functions";
import { toastResponseOutput } from "@/lib/utils/service-output";

// Schemas
import { ImageKeysSchemaArgs } from "@repo/schemas/image";
import { PresignImagesSchemaArgs } from "@repo/schemas/image";

export async function getImageFromKeyService({
  imageUrls,
}: ImageKeysSchemaArgs) {
  const uniqueKeys = [...new Set(imageUrls)];

  const urls: Record<string, string> = {};

  await Promise.all(
    uniqueKeys.map(
      async (key) => (urls[key] = await getImagePresignedUrls(key)),
    ),
  );

  return toastResponseOutput({
    message: "Successfully generated image URLs from upload",
    title: "Image URLs generated",
    status: 200,
    data: { urls },
  });
}

export async function presignDirectMessageImagesService({
  images: dataImages,
}: PresignImagesSchemaArgs) {
  const images = await Promise.all(
    dataImages.map(async (image) =>
      createUploadUrl({
        contentType: image.contentType,
        filename: image.filename,
        size: image.size,
      }),
    ),
  );

  return toastResponseOutput({
    message: "Successfully generated presigned URLs",
    title: "Presigned URLs generated",
    status: 200,
    data: { images },
  });
}
