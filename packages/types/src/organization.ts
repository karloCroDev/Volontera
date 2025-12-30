import { Orgnizations } from "@repo/database";
import { SuccessfulResponse } from "./general";

export type CreateOrganizationResponse = SuccessfulResponse & {
  organizationId: Orgnizations["id"];
};
