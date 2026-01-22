import {
  OrganizationMember,
  OrganizationTask,
  OrganizationTaskInfo,
  OrganizationTaskQuestions,
  OrganizationTasksBoards,
  User,
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

export type RetrieveOrganizationMembersResponse = ServerHandleResponse<true> & {
  organizationMembers: (OrganizationMember & {
    user: User;
  })[];
};

export type RetrieveTaskInfoResponse = ServerHandleResponse<boolean> & {
  taskInfo?: OrganizationTaskInfo & {
    organizationTask: OrganizationTask;
    organizatonMembersAsiggnedToTaskCards: {
      organizationMember: OrganizationMember & {
        user: User;
      };
    }[];
  };
};

export type RetrieveTaskQuestionsResponse = ServerHandleResponse<true> & {
  questions: (OrganizationTaskQuestions & {
    author: User;
  })[];
};
