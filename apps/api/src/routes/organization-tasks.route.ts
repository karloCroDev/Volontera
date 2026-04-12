// External packages
import express from "express";
import { Router } from "express";

// Controllers
import {
  createTaskBoardController,
  createTaskController,
  createTaskQuestionController,
  deleteOrganizationTaskBoardController,
  deleteTaskByIdController,
  deleteTaskQuestionController,
  retrieveOrganizationMembersController,
  retrieveAllBoardTasksController,
  retrieveAllOrganizationBoardsController,
  retrieveAllOrganizationBoardsWithTasksController,
  retrieveTaskInfoController,
  retrieveTaskQuestionsController,
  updateOrganizationTaskBoardTitleController,
  updateTaskInfoController,
  moveTaskController,
  createLlmTaskController,
} from "@/controllers/organization-tasks.controller";

// Middleware
import { organizationRolesMiddleware } from "@/middleware/organization-roles.middleware";
import { validate } from "@/middleware/validate.middleware";
import { proPlanUserMiddleware } from "@/middleware/payment.middleware";

// Schemas
import {
  createTaskBoardSchema,
  createTaskQuestionSchema,
  createTaskSchema,
  deleteOrganizationTaskBoardSchema,
  deleteTaskByIdSchema,
  retrieveAllOrganizationBoardsWithTasksSchema,
  retrieveOrganizationMembersSchema,
  retrieveTaskInfoSchema,
  retrieveTaskQuestionsSchema,
  updateOrganizationTaskBoardTitleSchema,
  updateTaskInfoSchema,
  moveTaskSchema,
  deleteTaskQuestionSchema,
  retrieveAllBoardTasksSchema,
  retrieveAllBoardTasksQuerySchema,
  retrieveAllOrganizationBoardSchema,
  createLlmTaskSchema,
} from "@repo/schemas/organization-tasks";

export const organizationTasksRoutes = Router();

organizationTasksRoutes.use(express.json());

// Boards
organizationTasksRoutes.post(
  "/boards/create",
  validate({
    schema: createTaskBoardSchema,
    responseOutput: "toast",
    type: "body",
  }),
  organizationRolesMiddleware({ aquiredRoles: ["ADMIN", "OWNER"] }),
  createTaskBoardController,
);

organizationTasksRoutes.patch(
  "/boards/update-title",
  validate({
    schema: updateOrganizationTaskBoardTitleSchema,
    responseOutput: "toast",
    type: "body",
  }),
  organizationRolesMiddleware({ aquiredRoles: ["ADMIN", "OWNER"] }),
  updateOrganizationTaskBoardTitleController,
);

organizationTasksRoutes.delete(
  "/boards/:organizationId/:organizationTaskBoardId",
  validate({
    schema: deleteOrganizationTaskBoardSchema,
    responseOutput: "toast",
    type: "params",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["ADMIN", "OWNER"],
    type: "params",
  }),
  deleteOrganizationTaskBoardController,
);

organizationTasksRoutes.get(
  "/boards/:organizationId",
  validate({
    schema: retrieveAllOrganizationBoardSchema,
    responseOutput: "server",
    type: "params",
  }),
  organizationRolesMiddleware({
    type: "params",
    aquiredRoles: ["MEMBER", "ADMIN", "OWNER"],
  }),
  retrieveAllOrganizationBoardsController,
);

// Boards with tasks
organizationTasksRoutes.get(
  "/boards-with-tasks/:organizationId",
  validate({
    schema: retrieveAllOrganizationBoardsWithTasksSchema,
    type: "params",
    responseOutput: "server",
  }),
  validate({
    schema: retrieveAllBoardTasksQuerySchema,
    type: "query",
    responseOutput: "server",
  }),
  organizationRolesMiddleware({
    type: "params",
    aquiredRoles: ["MEMBER", "ADMIN", "OWNER"],
  }),
  retrieveAllOrganizationBoardsWithTasksController,
);

// Members (for task assignment)
organizationTasksRoutes.get(
  "/members/:organizationId",
  validate({
    schema: retrieveOrganizationMembersSchema,
    responseOutput: "server",
    type: "params",
  }),
  organizationRolesMiddleware({
    type: "params",
    aquiredRoles: ["MEMBER", "ADMIN", "OWNER"],
  }),
  retrieveOrganizationMembersController,
);

// Tasks
organizationTasksRoutes.get(
  "/tasks/:organizationId/:organizationTaskBoardId",
  validate({
    schema: retrieveAllBoardTasksSchema,
    responseOutput: "server",
    type: "params",
  }),
  validate({
    schema: retrieveAllBoardTasksQuerySchema,
    responseOutput: "server",
    type: "query",
  }),
  organizationRolesMiddleware({
    type: "params",
    aquiredRoles: ["MEMBER", "ADMIN", "OWNER"],
  }),
  retrieveAllBoardTasksController,
);

organizationTasksRoutes.post(
  "/tasks/create",
  validate({
    schema: createTaskSchema,
    responseOutput: "toast",
    type: "body",
  }),
  organizationRolesMiddleware({ aquiredRoles: ["ADMIN", "OWNER"] }),
  createTaskController,
);
organizationTasksRoutes.post(
  "/tasks/create-llm",
  validate({
    schema: createLlmTaskSchema,
    responseOutput: "toast",
    type: "body",
  }),
  organizationRolesMiddleware({ aquiredRoles: ["ADMIN", "OWNER"] }),
  proPlanUserMiddleware, // TODO: See if I am going to handle if the organization is premium or the user
  createLlmTaskController,
);

organizationTasksRoutes.get(
  "/tasks/:organizationId/:taskId/info",
  validate({
    schema: retrieveTaskInfoSchema,
    responseOutput: "server",
    type: "params",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["MEMBER", "ADMIN", "OWNER"],
    type: "params",
  }),
  retrieveTaskInfoController,
);

organizationTasksRoutes.get(
  "/tasks/:organizationId/:taskId/questions",
  validate({
    schema: retrieveTaskQuestionsSchema,
    responseOutput: "server",
    type: "params",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["MEMBER", "ADMIN", "OWNER"],
    type: "params",
  }),
  retrieveTaskQuestionsController,
);

organizationTasksRoutes.patch(
  "/tasks/update",
  validate({
    schema: updateTaskInfoSchema,
    responseOutput: "toast",
    type: "body",
  }),
  organizationRolesMiddleware({ aquiredRoles: ["ADMIN", "OWNER"] }),
  updateTaskInfoController,
);

organizationTasksRoutes.patch(
  "/tasks/move",
  validate({
    schema: moveTaskSchema,
    responseOutput: "toast",
    type: "body",
  }),
  organizationRolesMiddleware({ aquiredRoles: ["ADMIN", "OWNER"] }),
  moveTaskController,
);

organizationTasksRoutes.delete(
  "/tasks/:organizationId/:taskId",
  validate({
    schema: deleteTaskByIdSchema,
    responseOutput: "toast",
    type: "params",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["ADMIN", "OWNER"],
    type: "params",
  }),
  deleteTaskByIdController,
);

// Questions
organizationTasksRoutes.post(
  "/tasks/question",
  validate({
    schema: createTaskQuestionSchema,
    responseOutput: "toast",
    type: "body",
  }),
  organizationRolesMiddleware({ aquiredRoles: ["MEMBER", "ADMIN", "OWNER"] }),
  createTaskQuestionController,
);

organizationTasksRoutes.delete(
  "/tasks/question/:organizationId/:questionId",
  validate({
    schema: deleteTaskQuestionSchema,
    responseOutput: "toast",
    type: "params",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["MEMBER", "ADMIN", "OWNER"],
    type: "params",
  }),
  deleteTaskQuestionController,
);
