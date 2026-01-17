// External packages
import { z } from "zod";

// Schemas
import { uploadImageSchema } from "./image";

export const organizationIdSchema = z.object({
  organizationId: z.cuid(),
});

export const createOrganizationSchema = z.object({
  organization_avatar_image: uploadImageSchema.shape.image,
  organization_cover_image: uploadImageSchema.shape.image,
  organization_name: z.string().min(1).max(100),
  organization_bio: z.string().min(10),
  organization_type: z.string(),
  organization_location: z.string().optional(),
  external_form_link: z.url().or(z.literal("")).optional(),
  additional_links: z
    .array(
      z
        .object({
          // Allow empty rows in the UI; we'll validate pair completeness below.
          label: z.string(),
          url: z.string(),
        })
        .superRefine((link) => {
          const label = link.label.trim();
          const url = link.url.trim();

          const hasLabel = label.length > 0;
          const hasUrl = url.length > 0;

          // Fully empty row is allowed (user didn't want to add a link).
          if (!hasLabel && !hasUrl) return;
        }),
    )
    .transform((links) =>
      links
        .map((link) => ({
          label: link.label.trim(),
          url: link.url.trim(),
        }))
        .filter((link) => link.label !== "" && link.url !== ""),
    )
    .optional(),
  assignPredefinedTasks: z.boolean(),
});
export type CreateOrganizationArgs = z.infer<typeof createOrganizationSchema>;

export const getOrganizationDetailsByIdSchema = z.object({
  organizationId: z.cuid(),
});

export type GetOrganizationDetailsByIdArgs = z.infer<
  typeof getOrganizationDetailsByIdSchema
>;

export const sendRequestToJoinOrganizationSchema = z
  .object({
    title: z.string().min(1).max(20),
    content: z.string().min(1).max(200),
  })
  .extend(organizationIdSchema.shape);
export type SendRequestToJoinOrganizationArgs = z.infer<
  typeof sendRequestToJoinOrganizationSchema
>;

export const toggleFollowOrganizationSchema = organizationIdSchema;
export type ToggleFollowOrganizationArgs = z.infer<
  typeof toggleFollowOrganizationSchema
>;
