// Lib
import {
  serverFetchOutput,
  toastResponseOutput,
} from "@/lib/utils/service-output";

// Models
import {
  createNotification,
  createNotifications,
} from "@/models/notification.model";

// Models
import {
  retrieveOrganizationMember,
  retirveAllRequestsToJoinOrganization,
  retrieveAllMembersInOrganization,
  demoteOrPromoteOrganizationMember,
  acceptOrDeclineUsersRequestToJoinOrganization,
  leaveOrganization,
  retrieveDataAboutOrganization,
  deleteOrganizationAsOwner,
} from "@/models/organization-managment.model";

// Database
import { User } from "@repo/database";

// Schemas
import {
  AcceptOrDeclineUsersRequestToJoinOrganizationArgs,
  DeleteOrganizationArgs,
  DemoteOrPromoteOrganizationMemberArgs,
  LeaveOrganizationArgs,
  RetirveAllRequestsToJoinOrganizationArgs,
  RetrieveAllMembersInOrganizationArgs,
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

export async function acceptOrDeclineUsersRequestToJoinOrganizationService(
  data: AcceptOrDeclineUsersRequestToJoinOrganizationArgs,
) {
  const affectedRequesterIds =
    await acceptOrDeclineUsersRequestToJoinOrganization(data);

  // Ili su svi prihvaćeni ili su svi odbijeni
  const isApproved = data.status === "APPROVED";

  await createNotifications(
    affectedRequesterIds.map((requesterId) => ({
      userId: requesterId,
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

export async function demoteOrPromoteOrganizationMemberService(
  data: DemoteOrPromoteOrganizationMemberArgs,
) {
  const result = await demoteOrPromoteOrganizationMember(data);
  await createNotification({
    content:
      result.role === "ADMIN"
        ? "You have been promoted to admin in the organization."
        : "You have been demoted to member in the organization.",
    userId: data.userId,
  });

  return toastResponseOutput({
    message: "Organization member role updated successfully",
    title: "Member Role Updated",
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
  });

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
