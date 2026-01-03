// External packages
import { z } from "zod";

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
  postId: z.cuid().or(z.literal("")),
  ...createPostSchema.omit({ organizationId: true }),
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

export const retrievePostWithCommentsSchema = z.object({
  postId: z.cuid(),
});
export type RetrievePostWithCommentsArgs = z.infer<
  typeof retrievePostWithCommentsSchema
>;
