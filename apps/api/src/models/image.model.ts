// External packages
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";

// Lib
import { s3 } from "@/config/aws";
import { getKeyFromUrl } from "@/lib/aws-s3-functions";

// TODO: Make api for fething urls from presigned urls for multiple images
// export async function getImagePresignedUrls(image: string) {
//   // Deduplicate
//   const uniqueKeys = [...new Set(keys)];

//   // (VERY IMPORTANT) authorize keys
//   // Example: ensure user owns or can access these images
//   // await authorizeImageAccess(session.user.id, uniqueKeys);

//   const urls: Record<string, string> = {};

//   await Promise.all(
//     uniqueKeys.map(async (key) => {
//       const command = new GetObjectCommand({
//         Bucket: process.env.AWS_S3_BUCKET_NAME!,
//         Key: key,
//       });

//       urls[key] = await getSignedUrl(s3, command, {
//         expiresIn: 3600,
//       });
//     })
//   );

//   return Response.json({ urls });
// }
