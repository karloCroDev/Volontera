// Schemas
import {
  createOrganization,
  getOrganizationDetailsById,
} from "@/models/organization.model";
import { User } from "@repo/database";
import {
  createOrganizationSchema,
  getOrganizationDetailsByIdSchema,
} from "@repo/schemas/create-organization";

export async function CreateOrganizationService({
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

  const organization = await createOrganization({
    data,
    userId,
  });

  return {
    status: 201,
    body: {
      title: "Organization Created",
      message: "Organization created successfully",
      organizationId: organization.id,
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
      },
    };
  }

  const organization = await getOrganizationDetailsById(data.organizationId);

  if (!organization) {
    return {
      status: 404,
      body: {
        title: "Organization Not Found",
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
