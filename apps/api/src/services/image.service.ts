// Lib
import { getImagePresignedUrls } from "@/lib/aws-s3-functions";

// Schemas
import { imageKeysSchema } from "@repo/schemas/image";

// Database
import { User } from "@repo/database";

export async function getImageFromKeyService({
  rawData,
  userId,
}: {
  rawData: unknown;
  userId: User["id"];
}) {
  const { data, success } = imageKeysSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: { success: false, message: "Invalid input data" },
    };
  }

  const uniqueKeys = [...new Set(data.imageUrls)];

  const urls: Record<string, string> = {}; // {key: url}

  await Promise.all(
    uniqueKeys.map(
      // Ovo ne zove awsov server vec samo od kljuća
      async (key) => (urls[key] = await getImagePresignedUrls(key))
    )
  );

  return {
    status: 200,
    body: {
      success: true,
      title: "Image URLs",
      message: "Successfuly get image url from the keys",
      urls,
    },
  };
}
