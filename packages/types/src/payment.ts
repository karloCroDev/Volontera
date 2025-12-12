import { SuccessfulResponse } from "./general";

export type GeneratePaymentLinkResponse = SuccessfulResponse & {
  url: string;
};
