// External packages
import { organizationIdSchema } from "./organization";
import { z } from "zod";

// Boards
export const createTaskBoardSchema = z
  .object({
    title: z.string().min(1).max(100),
  })
  .extend(organizationIdSchema.shape);
export type CreateTaskBoardArgs = z.infer<typeof createTaskBoardSchema>;

export const updateOrganizationTaskBoardTitleSchema = z
  .object({
    organizationTaskBoardId: z.cuid(),
    title: z.string().min(1).max(100),
  })
  .extend(organizationIdSchema.shape);
export type UpdateOrganizationTaskBoardTitleArgs = z.infer<
  typeof updateOrganizationTaskBoardTitleSchema
>;

export const deleteOrganizationTaskBoardSchema = z
  .object({
    organizationTaskBoardId: z.cuid(),
  })
  .extend(organizationIdSchema.shape);
export type DeleteOrganizationTaskBoardArgs = z.infer<
  typeof deleteOrganizationTaskBoardSchema
>;

export const retrieveAllOrganizationBoardsWithTasksSchema = z
  .object({
    organizationId: z.cuid(),
  })
  .extend(organizationIdSchema.shape);
export type RetrieveAllOrganizationBoardsWithTasksArgs = z.infer<
  typeof retrieveAllOrganizationBoardsWithTasksSchema
>;

// Tasks
export const createTaskSchema = z
  .object({
    organizationId: z.cuid(),
    description: z.string().min(1),
    dueDate: z.coerce.date().nullable(),
  })
  .extend(organizationIdSchema.shape);
export type CreateTaskArgs = z.infer<typeof createTaskSchema>;

export const retrieveTaskInfoSchema = z
  .object({
    taskId: z.cuid(),
  })
  .extend(organizationIdSchema.shape);
export type RetrieveTaskInfoArgs = z.infer<typeof retrieveTaskInfoSchema>;

export const retrieveTaskQuestionsSchema = z
  .object({
    taskId: z.cuid(),
  })
  .extend(organizationIdSchema.shape);
export type RetrieveTaskQuestionsArgs = z.infer<
  typeof retrieveTaskQuestionsSchema
>;

export const updateTaskInfoSchema = z
  .object({
    taskId: z.cuid(),
    title: z.string().min(1).max(100),
    description: z.string().min(1),
    dueDate: z.coerce.date().nullable(),
  })
  .extend(organizationIdSchema.shape);
export type UpdateTaskInfoArgs = z.infer<typeof updateTaskInfoSchema>;

export const deleteTaskByIdSchema = z
  .object({
    taskId: z.cuid(),
  })
  .extend(organizationIdSchema.shape);
export type DeleteTaskByIdArgs = z.infer<typeof deleteTaskByIdSchema>;

// Questions
export const createTaskQuestionSchema = z
  .object({
    taskId: z.cuid(),
    question: z.string().min(1).max(2000),
    userId: z.cuid(),
  })
  .extend(organizationIdSchema.shape);
export type CreateTaskQuestionArgs = z.infer<typeof createTaskQuestionSchema>;

export const deleteTaskQuestionSchema = z
  .object({
    questionId: z.cuid(),
    userId: z.cuid(),
  })
  .extend(organizationIdSchema.shape);
export type DeleteTaskQuestionArgs = z.infer<typeof deleteTaskQuestionSchema>;
