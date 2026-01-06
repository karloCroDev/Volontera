// Schemas
import { createUploadUrl } from "@/lib/aws-s3-functions";
import {
  createOrganization,
  getOrganizationDetailsById,
  listOrganizationsOrganizatorGrouped,
  listOrganizationsUser,
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

  const organizationAvatarUploadUrl = await createUploadUrl(
    data.organization_avatar_image
  );

  const organizationCoverUploadUrl = await createUploadUrl(
    data.organization_cover_image
  );

  const organization = await createOrganization({
    data,
    userId,
    imageKeys: {
      avatarImageKey: organizationAvatarUploadUrl.key,
      coverImageKey: organizationCoverUploadUrl.key,
    },
  });

  return {
    status: 201,
    body: {
      title: "Organization Created",
      message: "Organization created successfully",
      organizationId: organization.id,
      imageAvatar: organizationAvatarUploadUrl.url,
      imageCover: organizationCoverUploadUrl.url,
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

export async function listOrganizationsUserService(userId: User["id"]) {
  const { attendingOrganizations, followingOrganizations } =
    await listOrganizationsUser(userId);
  return {
    status: 200,
    body: {
      message: "Organizations retrieved successfully",
      attendingOrganizations,
      followingOrganizations,
    },
  };
}

export async function listOrganizationsOrganizatorService(
  organizatorId: User["id"]
) {
  const { ownedOrganizations, followingOrganizations, attendingOrganizations } =
    await listOrganizationsOrganizatorGrouped(organizatorId);

  console.log(ownedOrganizations);
  return {
    status: 200,
    body: {
      title: "Organizations Retrieved",
      message: "Organizations retrieved successfully",
      ownedOrganizations,
      followingOrganizations,
      attendingOrganizations,
    },
  };
}
