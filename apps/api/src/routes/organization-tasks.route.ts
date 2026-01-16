// External packages
import express from "express";
import { Router } from "express";
import { z } from "zod";

// Controllers
import {
  createTaskBoardController,
  createTaskController,
  createTaskQuestionController,
  deleteOrganizationTaskBoardController,
  deleteTaskByIdController,
  deleteTaskQuestionController,
  retrieveAllBoardTasksController,
  retrieveAllOrganizationBoardsController,
  retrieveAllOrganizationBoardsWithTasksController,
  retrieveTaskInfoController,
  retrieveTaskQuestionsController,
  updateOrganizationTaskBoardTitleController,
  updateTaskInfoController,
  moveTaskController,
} from "@/controllers/organization-tasks.controller";

// Middleware
import { organizationRolesMiddleware } from "@/middleware/organization-roles.middleware";
import { validate } from "@/middleware/validate.middleware";

// Schemas
import {
  createTaskBoardSchema,
  createTaskQuestionSchema,
  createTaskSchema,
  deleteOrganizationTaskBoardSchema,
  deleteTaskByIdSchema,
  retrieveAllOrganizationBoardsWithTasksSchema,
  retrieveTaskInfoSchema,
  retrieveTaskQuestionsSchema,
  updateOrganizationTaskBoardTitleSchema,
  updateTaskInfoSchema,
  moveTaskSchema,
  deleteTaskQuestionSchema,
  retrieveAllBoardTasksSchema,
  retrieveAllOrganizationBoardSchema,
} from "@repo/schemas/organization-tasks";
import { retrieveAllBoardTasks } from "@/models/organization-tasks.model";

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
  organizationRolesMiddleware({ aquiredRoles: ["MEMBER", "ADMIN"] }),
  createTaskBoardController
);

organizationTasksRoutes.patch(
  "/boards/update-title",
  validate({
    schema: updateOrganizationTaskBoardTitleSchema,
    responseOutput: "toast",
    type: "body",
  }),
  organizationRolesMiddleware({ aquiredRoles: ["MEMBER", "ADMIN"] }),
  updateOrganizationTaskBoardTitleController
);

organizationTasksRoutes.delete(
  "/boards/:organizationId/:organizationTaskBoardId",
  validate({
    schema: deleteOrganizationTaskBoardSchema,
    responseOutput: "toast",
    type: "params",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["MEMBER", "ADMIN"],
    type: "params",
  }),
  deleteOrganizationTaskBoardController
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
    aquiredRoles: ["MEMBER", "ADMIN"],
  }),
  retrieveAllOrganizationBoardsController
);

// Boards with tasks
organizationTasksRoutes.get(
  "/boards-with-tasks/:organizationId",
  validate({
    schema: retrieveAllOrganizationBoardsWithTasksSchema,
    type: "params",
    responseOutput: "server",
  }),
  organizationRolesMiddleware({
    type: "params",
    aquiredRoles: ["MEMBER", "ADMIN"],
  }),
  retrieveAllOrganizationBoardsWithTasksController
);

// Tasks
organizationTasksRoutes.get(
  "/tasks/:organizationId/:organizationTaskBoardId",
  validate({
    schema: retrieveAllBoardTasksSchema,
    responseOutput: "server",
    type: "params",
  }),
  organizationRolesMiddleware({
    type: "params",
    aquiredRoles: ["MEMBER", "ADMIN"],
  }),
  retrieveAllBoardTasksController
);

organizationTasksRoutes.post(
  "/tasks/create",
  validate({
    schema: createTaskSchema,
    responseOutput: "toast",
    type: "body",
  }),
  organizationRolesMiddleware({ aquiredRoles: ["MEMBER", "ADMIN"] }),
  createTaskController
);

organizationTasksRoutes.get(
  "/tasks/:organizationId/:taskId/info",
  validate({
    schema: retrieveTaskInfoSchema,
    responseOutput: "server",
    type: "params",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["MEMBER", "ADMIN"],
    type: "params",
  }),
  retrieveTaskInfoController
);

organizationTasksRoutes.get(
  "/tasks/:organizationId/:taskId/questions",
  validate({
    schema: retrieveTaskQuestionsSchema,
    responseOutput: "server",
    type: "params",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["MEMBER", "ADMIN"],
    type: "params",
  }),
  retrieveTaskQuestionsController
);

organizationTasksRoutes.patch(
  "/tasks/update",
  validate({
    schema: updateTaskInfoSchema,
    responseOutput: "toast",
    type: "body",
  }),
  organizationRolesMiddleware({ aquiredRoles: ["MEMBER", "ADMIN"] }),
  updateTaskInfoController
);

organizationTasksRoutes.patch(
  "/tasks/move",
  validate({
    schema: moveTaskSchema,
    responseOutput: "toast",
    type: "body",
  }),
  organizationRolesMiddleware({ aquiredRoles: ["MEMBER", "ADMIN"] }),
  moveTaskController
);

organizationTasksRoutes.delete(
  "/tasks/:organizationId/:taskId",
  validate({
    schema: deleteTaskByIdSchema,
    responseOutput: "toast",
    type: "params",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["MEMBER", "ADMIN"],
    type: "params",
  }),
  deleteTaskByIdController
);

// Questions
organizationTasksRoutes.post(
  "/tasks/question",
  validate({
    schema: createTaskQuestionSchema,
    responseOutput: "toast",
    type: "body",
  }),
  organizationRolesMiddleware({ aquiredRoles: ["MEMBER", "ADMIN"] }),
  createTaskQuestionController
);

organizationTasksRoutes.delete(
  "/tasks/question/:organizationId/:questionId",
  validate({
    schema: deleteTaskQuestionSchema,
    responseOutput: "toast",
    type: "params",
  }),
  organizationRolesMiddleware({
    aquiredRoles: ["MEMBER", "ADMIN"],
    type: "params",
  }),
  deleteTaskQuestionController
);
