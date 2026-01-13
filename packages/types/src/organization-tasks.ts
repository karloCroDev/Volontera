import {
  OrganizationMember,
  OrganizationTask,
  OrganizationTaskInfo,
  OrganizationTaskQuestions,
  OrganizationTasksBoards,
} from "@repo/database";
import { ServerHandleResponse } from "./general";

export type RetrieveAllOrganizationBoardsWithTasksResponse =
  ServerHandleResponse<true> & {
    boardsWithTasks: (OrganizationTasksBoards & {
      organizationTasks: OrganizationTask[];
    })[];
  };

export type RetrieveAllOrganizationBoardsResponse =
  ServerHandleResponse<true> & {
    boards: OrganizationTasksBoards[];
  };

export type RetrieveAllBoardTasksResponse = ServerHandleResponse<true> & {
  tasks: OrganizationTask[];
};

export type RetrieveTaskInfoResponse = ServerHandleResponse<boolean> & {
  taskInfo?: OrganizationTaskInfo & {
    organizationTask: OrganizationTask;
    membersAssigned: OrganizationMember[];
  };
};

export type RetrieveTaskQuestionsResponse = ServerHandleResponse<true> & {
  questions: OrganizationTaskQuestions[];
};
