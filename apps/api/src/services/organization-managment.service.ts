// Schemas
import {
  retrieveOrganizationMember,
  retirveAllRequestsToJoinOrganization,
  retrieveAllUsersInOrganization,
} from "@/models/organization-managment.model";

// Database
import { User } from "@repo/database";

// Schemas
import {
  retirveAllRequestsToJoinOrganizationSchema,
  retrieveAllUsersInOrganizationSchema,
  retrieveOrganizationMemberSchema,
} from "@repo/schemas/organization-managment";

export async function retirveAllRequestsToJoinOrganizationService({
  rawData,
}: {
  rawData: unknown;
}) {
  const { success, data } =
    retirveAllRequestsToJoinOrganizationSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: {
        success: false,
        message: "The provided data is invalid",
      },
    };
  }
  const requests = await retirveAllRequestsToJoinOrganization(
    data.organizationId
  );

  return {
    status: 200,
    body: {
      success: true,
      message: "Requests retrieved successfully",
      requests,
    },
  };
}

export async function retrieveAllUsersInOrganizationService({
  rawData,
}: {
  rawData: unknown;
}) {
  const { success, data } =
    retrieveAllUsersInOrganizationSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: {
        success: false,
        message: "The provided data is invalid",
      },
    };
  }
  const requests = await retrieveAllUsersInOrganization(data.organizationId);

  return {
    status: 200,
    body: {
      success: true,
      message: "Requests retrieved successfully",
      requests,
    },
  };
}

export async function retrieveOrganizationMemberService({
  rawData,
  userId,
}: {
  rawData: unknown;
  userId: User["id"];
}) {
  const { success, data } = retrieveOrganizationMemberSchema.safeParse(rawData);

  if (!success) {
    return {
      status: 400,
      body: {
        message: "The provided data is invalid",
      },
    };
  }
  const organizationMember = await retrieveOrganizationMember({
    organizationId: data.organizationId,
    userId,
  });

  return {
    status: 200,
    body: {
      organizationMember,
    },
  };
}
