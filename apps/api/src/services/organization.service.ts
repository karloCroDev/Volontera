// Schemas
import { createUploadUrl } from "@/lib/aws-s3-functions";
import {
  createOrganization,
  getOrganizationDetailsById,
} from "@/models/organization.model";
import { User } from "@repo/database";
import {
  createOrganizationSchema,
  getOrganizationDetailsByIdSchema,
} from "@repo/schemas/create-organization";

export async function createOrganizationService({
  rawData,
  userId,
}: {
  rawData: unknown;
  userId: User["id"];
}) {
  const { success, data } = createOrganizationSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: {
        message: "The provided data is invalid",
      },
    };
  }

  const organizationAvatarUploadUrl = data.organization_avatar_image
    ? await createUploadUrl(data.organization_avatar_image)
    : undefined;
  const organizationCoverUploadUrl = data.organization_cover_image
    ? await createUploadUrl(data.organization_cover_image)
    : undefined;

  const organization = await createOrganization({
    data,
    userId,
    imageKeys: {
      avatarImageKey: organizationAvatarUploadUrl?.key,
      coverImageKey: organizationCoverUploadUrl?.key,
    },
  });

  return {
    status: 201,
    body: {
      title: "Organization Created",
      message: "Organization created successfully",
      organizationId: organization.id,
      imageAvatar: organizationAvatarUploadUrl?.url,
      imageCover: organizationCoverUploadUrl?.url,
    },
  };
}

export async function getOrganizationDetailsByIdService(rawData: unknown) {
  const { success, data } = getOrganizationDetailsByIdSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: {
        message: "The provided data is invalid",
        success: false,
      },
    };
  }

  const organization = await getOrganizationDetailsById(data.organizationId);

  if (!organization) {
    return {
      status: 404,
      body: {
        title: "Organization Not Found",
        success: false,
        message: "No organization found with the provided ID",
      },
    };
  }

  return {
    status: 200,
    body: {
      message: "Organization details retrieved successfully",
      success: true,
      organization,
    },
  };
}
