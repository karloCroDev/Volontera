// Lib
import {
  serverFetchOutput,
  toastResponseOutput,
} from "@/lib/utils/service-output";

// Models
import {
  retrieveOrganizationMember,
  retirveAllRequestsToJoinOrganization,
  retrieveAllMembersInOrganization,
  demoteOrPromoteOrganizationMember,
  acceptOrDeclineUsersRequestToJoinOrganization,
} from "@/models/organization-managment.model";

// Database
import { User } from "@repo/database";

// Schemas
import {
  AcceptOrDeclineUsersRequestToJoinOrganizationArgs,
  DemoteOrPromoteOrganizationMemberArgs,
  RetirveAllRequestsToJoinOrganizationArgs,
  RetrieveAllMembersInOrganizationArgs,
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
  const requests = await retrieveAllMembersInOrganization({
    organizationId: data.organizationId,
    userId,
  });

  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Users retrieved successfully",
    data: { requests },
  });
}

export async function acceptOrDeclineUsersRequestToJoinOrganizationService({
  data,
  userId,
}: {
  data: AcceptOrDeclineUsersRequestToJoinOrganizationArgs;
  userId: User["id"];
}) {
  await acceptOrDeclineUsersRequestToJoinOrganization({
    ...data,
    requesterId: userId,
  });

  return toastResponseOutput({
    title: "Requests Updated",
    message: "User's request to join organization updated successfully",
    status: 200,
  });
}

export async function demoteOrPromoteOrganizationMemberService({
  data,
  userId,
}: {
  data: DemoteOrPromoteOrganizationMemberArgs;
  userId: User["id"];
}) {
  await demoteOrPromoteOrganizationMember({
    ...data,
    userId,
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
