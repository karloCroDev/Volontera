import {
  OrganizationCalendar,
  OrganizationCalendarEvent,
} from "@repo/database";
import { ServerHandleResponse } from "./general";

export type RetrieveOrganizationCalendarResponse =
  ServerHandleResponse<boolean> & {
    calendar: OrganizationCalendar & {
      events: OrganizationCalendarEvent[];
    };
  };
