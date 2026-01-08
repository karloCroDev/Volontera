// Schemas
import { createUploadUrl } from "@/lib/aws-s3-functions";
import {
  serverFetchOutput,
  toastResponseOutput,
} from "@/lib/utils/service-output";

// Models
import {
  createOrganization,
  getOrganizationDetailsById,
  listOrganizationsOrganizatorGrouped,
  listOrganizationsUser,
  sendRequestToJoinOrganization,
} from "@/models/organization.model";

// Database
import { User } from "@repo/database";

// Schema types
import {
  CreateOrganizationArgs,
  GetOrganizationDetailsByIdArgs,
  SendRequestToJoinOrganizationArgs,
} from "@repo/schemas/organization";

export async function createOrganizationService({
  data,
  userId,
}: {
  data: CreateOrganizationArgs;
  userId: User["id"];
}) {
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

  return toastResponseOutput({
    status: 200,
    message: "Organization created successfully",
    title: "Organization Created",
    data: {
      organizationId: organization.id,
      imageAvatar: organizationAvatarUploadUrl.url,
      imageCover: organizationCoverUploadUrl.url,
    },
  });
}

export async function getOrganizationDetailsByIdService({
  organizationId,
}: GetOrganizationDetailsByIdArgs) {
  const organization = await getOrganizationDetailsById(organizationId);

  if (!organization) {
    return serverFetchOutput({
      status: 400,
      success: false,
      message: "Organization not found",
    });
  }

  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Organization details retrieved successfully",
    data: { organization },
  });
}

export async function listOrganizationsUserService(userId: User["id"]) {
  const { attendingOrganizations, followingOrganizations } =
    await listOrganizationsUser(userId);

  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Organizations retrieved successfully",
    data: {
      attendingOrganizations,
      followingOrganizations,
    },
  });
}

export async function listOrganizationsOrganizatorService(
  organizatorId: User["id"] // Ovo je isto korisnik koji ima isti id
) {
  const { ownedOrganizations, followingOrganizations, attendingOrganizations } =
    await listOrganizationsOrganizatorGrouped(organizatorId);

  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Organizations retrieved successfully",
    data: {
      ownedOrganizations,
      followingOrganizations,
      attendingOrganizations,
    },
  });
}

export async function sendRequestToJoinOrganizationService({
  data,
  userId,
}: {
  data: SendRequestToJoinOrganizationArgs;
  userId: User["id"];
}) {
  await sendRequestToJoinOrganization({
    data,
    userId,
  });

  return toastResponseOutput({
    status: 200,
    title: "Request Sent",
    message: "Your request to join the organization has been sent",
  });
}
