import { ServerHandleResponse, SuccessfulResponse } from "./general";

export type GeneratePaymentLinkResponse = SuccessfulResponse & {
  url: string;
} & ServerHandleResponse<true>;
