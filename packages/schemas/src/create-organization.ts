// External packages
import { z } from "zod";

// Schemas
import { uploadImageSchema } from "./image";

export const createOrganizationSchema = z.object({
  organization_avatar_image: uploadImageSchema.shape.image.optional(),
  organization_cover_image: uploadImageSchema.shape.image.optional(),
  organization_name: z.string().min(1).max(100),
  organization_bio: z.string().min(10),
  organization_type: z.string(),
  organization_location: z.string().optional(),
  external_form_link: z.url().optional(),
  additional_links: z
    .array(
      z.object({
        label: z.string().min(1),
        url: z.url(),
      })
    )
    .optional(),
  assignPredefinedTasks: z.boolean().default(false),
});

export type CreateOrganizationArgs = z.infer<typeof createOrganizationSchema>;

export const getOrganizationDetailsByIdSchema = z.object({
  organizationId: z.cuid(),
});

export type GetOrganizationDetailsByIdArgs = z.infer<
  typeof getOrganizationDetailsByIdSchema
>;
