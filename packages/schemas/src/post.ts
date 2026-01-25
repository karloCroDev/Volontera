// External packages
import { array, string, z } from "zod";

// Schemas
import { uploadImageSchema } from "./image";

// Organization admins only
export const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().max(200),
  images: uploadImageSchema.shape.image
    .array()
    .min(1, "Please upload at least one image"),
  organizationId: z.cuid(),
});

export type CreatePostArgs = z.infer<typeof createPostSchema>;

export const updatePostSchema = z.object({
  postId: z.cuid(),
  ...createPostSchema.omit({ organizationId: true, images: true }).shape,
  images: z.array(z.union([z.string(), uploadImageSchema.shape.image])),
});

export type UpdatePostArgs = z.infer<typeof updatePostSchema>;

export const deletePostSchema = z.object({
  postId: z.cuid(),
});
export type DeletePostArgs = z.infer<typeof deletePostSchema>;

// Everyone
export const retrieveOrganizationPostsSchema = z.object({
  organizationId: z.cuid(),
});

export type RetrieveOrganizationPostsArgs = z.infer<
  typeof retrieveOrganizationPostsSchema
>;

export const retrieveOrganizationPostsQuerySchema = z.object({
  filter: z.enum(["recommended", "newest", "oldest"]).optional(),
});

export type RetrieveOrganizationPostsQueryArgs = z.infer<
  typeof retrieveOrganizationPostsQuerySchema
>;

export const retrieveOrganizationPostsRequestSchema =
  retrieveOrganizationPostsSchema.merge(retrieveOrganizationPostsQuerySchema);

export type RetrieveOrganizationPostsRequestArgs = z.infer<
  typeof retrieveOrganizationPostsRequestSchema
>;

export const retrievePost = z.object({
  postId: z.cuid(),
});
export type RetrievePostArgs = z.infer<typeof retrievePost>;

export const likeOrDislikePostSchema = z.object({
  postId: z.cuid(),
});
export type LikeOrDislikePostArgs = z.infer<typeof likeOrDislikePostSchema>;
