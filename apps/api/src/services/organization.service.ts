// Schemas
import { createOrganization } from "@/models/organization.model";
import { User } from "@repo/database";
import { createOrganizationSchema } from "@repo/schemas/create-organization";

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
