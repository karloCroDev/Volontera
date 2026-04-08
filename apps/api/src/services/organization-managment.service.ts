// Lib
import { createUploadUrl } from "@/lib/aws-s3-functions";
import {
  serverFetchOutput,
  toastResponseOutput,
} from "@/lib/utils/service-output";
import { cacheKey, redisDeleteKey } from "@/lib/cache-json";

// Models
import {
  createNotification,
  createMultipleNotifications,
} from "@/models/notification.model";
import {
  retrieveOrganizationMember,
  retirveAllRequestsToJoinOrganization,
  retrieveAllMembersInOrganization,
  retrieveAllOrganizationLeaveFeedbacks,
  demoteOrPromoteOrganizationMember,
  removeOrganizationMember,
  acceptOrDeclineUsersRequestToJoinOrganization,
  leaveOrganization,
  retrieveDataAboutOrganization,
  deleteOrganizationAsOwner,
} from "@/models/organization-managment.model";
import { updateOrganization } from "@/models/organization.model";

// Database
import { User } from "@repo/database";
import { UpdateOrganizationArgs } from "@repo/schemas/organization-managment";

// Schemas
import {
  AcceptOrDeclineUsersRequestToJoinOrganizationArgs,
  DeleteOrganizationArgs,
  DemoteOrPromoteOrganizationMemberArgs,
  LeaveOrganizationArgs,
  RemoveOrganizationMemberArgs,
  RetirveAllRequestsToJoinOrganizationArgs,
  RetrieveAllMembersInOrganizationArgs,
  RetrieveAllOrganizationLeaveFeedbacksArgs,
  RetrieveDataAboutOrganizationArgs,
  RetrieveOrganizationMemberArgs,
} from "@repo/schemas/organization-managment";

// Samo vlasnik (managanje korisnika) (owner)
export async function retirveAllRequestsToJoinOrganizationService({
  organizationId,
}: RetirveAllRequestsToJoinOrganizationArgs) {
  const requests = await retirveAllRequestsToJoinOrganization(organizationId);

  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Requests retrieved successfully",
    data: { requests },
  });
}

export async function retrieveAllMembersInOrganizationService({
  data,
  userId,
}: {
  data: RetrieveAllMembersInOrganizationArgs;
  userId: User["id"];
}) {
  const members = await retrieveAllMembersInOrganization({
    organizationId: data.organizationId,
    userId,
  });

  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Users retrieved successfully",
    data: { members },
  });
}

export async function acceptOrDeclineUsersRequestToJoinOrganizationService({
  data,
  userId,
}: {
  data: AcceptOrDeclineUsersRequestToJoinOrganizationArgs;
  userId: User["id"];
}) {
  const affectedRequesterIds =
    await acceptOrDeclineUsersRequestToJoinOrganization(data);

  // Ili su svi prihvaćeni ili su svi odbijeni
  const isApproved = data.status === "APPROVED";

  await createMultipleNotifications(
    affectedRequesterIds.map((requesterId) => ({
      userId: requesterId,
      senderId: userId,
      content: isApproved
        ? "Your request to join the organization has been accepted."
        : "Your request to join the organization has been declined.",
    })),
  );

  return toastResponseOutput({
    title: "Requests Updated",
    message: isApproved
      ? "Users request to join organization updated successfully"
      : "Users request to join organization rejected successfully",
    status: 200,
  });
}

export async function demoteOrPromoteOrganizationMemberService({
  actorUserId,
  data,
}: {
  data: DemoteOrPromoteOrganizationMemberArgs;
  actorUserId: User["id"];
}) {
  const result = await demoteOrPromoteOrganizationMember(data);
  await createNotification({
    content:
      result.role === "ADMIN"
        ? "You have been promoted to admin in the organization."
        : result.role === "MEMBER"
          ? "You have been promoted to member in the organization."
          : "Your have beeen banned from this organization.",
    userId: data.userId,
    senderId: actorUserId,
  });

  return toastResponseOutput({
    message: "Organization member role updated successfully",
    title: "Member Role Updated",
    status: 200,
  });
}

export async function removeOrganizationMemberService({
  actorUserId,
  data,
}: {
  data: RemoveOrganizationMemberArgs;
  actorUserId: User["id"];
}) {
  await removeOrganizationMember(data);

  await createNotification({
    content: "You have been removed from the organization.",
    userId: data.userId,
    senderId: actorUserId,
  });

  return toastResponseOutput({
    message: "Organization member removed successfully",
    title: "Member Removed",
    status: 200,
  });
}

// Svi korisnici ("member" i "admin") unutar organizacije mogu dohvatiti informacije o samom sebi
export async function retrieveOrganizationMemberService({
  data,
  userId,
}: {
  data: RetrieveOrganizationMemberArgs;
  userId: User["id"];
}) {
  const organizationMember = await retrieveOrganizationMember({
    ...data,
    userId,
  });

  if (!organizationMember) {
    return serverFetchOutput({
      message: "Organization doesn't exists",
      success: false,
      status: 400,
    });
  }
  return serverFetchOutput({
    message: "Organization member retrieved successfully",
    success: true,
    data: { organizationMember },
    status: 200,
  });
}

export async function leaveOrganizationService({
  data,
  userId,
}: {
  data: LeaveOrganizationArgs;
  userId: User["id"];
}) {
  const member = await retrieveOrganizationMember({
    organizationId: data.organizationId,
    userId,
  });

  if (!member) {
    return toastResponseOutput({
      status: 400,
      title: "Not a member",
      message: "You are not a member of this organization",
    });
  }

  await leaveOrganization({
    organizationId: data.organizationId,
    userId,
    reason: data.reason,
  });

  await redisDeleteKey(
    cacheKey(["org", "member-role", data.organizationId, userId]),
  );

  return toastResponseOutput({
    status: 200,
    title: "Left organization",
    message: "You have left the organization successfully",
  });
}

export async function retrieveDataAboutOrganizationService({
  organizationId,
}: RetrieveDataAboutOrganizationArgs) {
  const {
    adminUserCount,
    highPriority,
    lowPriority,
    mediumPriority,
    memberUserCount,
    totalUserCount,
  } = await retrieveDataAboutOrganization(organizationId);

  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Organization data retrieved successfully",
    data: {
      adminUserCount,
      highPriority,
      lowPriority,
      mediumPriority,
      memberUserCount,
      totalUserCount,
    },
  });
}

export async function retrieveAllOrganizationLeaveFeedbacksService({
  organizationId,
}: RetrieveAllOrganizationLeaveFeedbacksArgs) {
  const leaveFeedbacks =
    await retrieveAllOrganizationLeaveFeedbacks(organizationId);

  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Leave feedbacks retrieved successfully",
    data: {
      leaveFeedbacks,
    },
  });
}

export async function updateOrganizationService({
  data,
}: {
  data: UpdateOrganizationArgs;
}) {
  const organizationAvatarUploadUrl = data.organization_avatar_image
    ? await createUploadUrl(data.organization_avatar_image)
    : null;

  const organizationCoverUploadUrl = data.organization_cover_image
    ? await createUploadUrl(data.organization_cover_image)
    : null;

  await updateOrganization({
    data,
    imageKeys: {
      avatarImageKey: organizationAvatarUploadUrl?.key,
      coverImageKey: organizationCoverUploadUrl?.key,
    },
  });

  return toastResponseOutput({
    status: 200,
    title: "Organization Updated",
    message: "Organization details updated successfully",
    data: {
      imageAvatar: organizationAvatarUploadUrl?.url,
      imageCover: organizationCoverUploadUrl?.url,
    },
  });
}

export async function deleteOrganizationService({
  data,
  userId,
}: {
  data: DeleteOrganizationArgs;
  userId: User["id"];
}) {
  await deleteOrganizationAsOwner({
    organizationId: data.organizationId,
    userId,
  });

  return toastResponseOutput({
    status: 200,
    title: "Organization Deleted",
    message: "Your organization has been deleted successfully",
  });
}
