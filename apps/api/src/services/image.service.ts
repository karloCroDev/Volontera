// Lib
import { createUploadUrl, getImagePresignedUrls } from "@/lib/aws-s3-functions";
import { toastResponseOutput } from "@/lib/utils/service-output";

// Schemas
import { ImageKeysSchemaArgs } from "@repo/schemas/image";
import { PresignImagesSchemaArgs } from "@repo/schemas/image";

// Nemoj ovo više korisiti na frontendu, jer mogu leakati sliku koja bi trebala biti privatna
export async function getImageFromKeyService({
  imageUrls,
}: ImageKeysSchemaArgs) {
  const urls = await resolveImageKeysToUrls(imageUrls);

  return toastResponseOutput({
    message: "Successfully generated image URLs from upload",
    title: "Image URLs generated",
    status: 200,
    data: { urls },
  });
}

export async function resolveImageKeysToUrls(
  imageUrls: Array<string | null | undefined>,
) {
  const uniqueKeys = [
    ...new Set(
      imageUrls.filter(
        (key): key is string => typeof key === "string" && key.length > 0,
      ),
    ),
  ];

  const urls: Record<string, string> = {};

  await Promise.all(
    uniqueKeys.map(async (key) => {
      try {
        urls[key] = await getImagePresignedUrls(key);
      } catch {
        // Ignore keys that cannot be resolved (missing object, invalid key, etc.)
      }
    }),
  );

  return urls;
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
