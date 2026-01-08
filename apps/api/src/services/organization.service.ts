// Schemas
import { createUploadUrl } from "@/lib/aws-s3-functions";

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

export async function getOrganizationDetailsByIdService({
  organizationId,
}: GetOrganizationDetailsByIdArgs) {
  const organization = await getOrganizationDetailsById(organizationId);

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
  organizatorId: User["id"] // Ovo je isto korisnik koji ima isti id
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

  return {
    status: 200,
    body: {
      title: "Request Sent",
      message: "Your request to join the organization has been sent",
    },
  };
}
