// External packages
import { z } from "zod";

// Boards
export const createTaskBoardSchema = z.object({
  title: z.string().min(1).max(100),
  organizationId: z.cuid(),
});
export type CreateTaskBoardArgs = z.infer<typeof createTaskBoardSchema>;

export const updateOrganizationTaskBoardTitleSchema = z.object({
  organizationTaskBoardId: z.cuid(),
  title: z.string().min(1).max(100),
});
export type UpdateOrganizationTaskBoardTitleArgs = z.infer<
  typeof updateOrganizationTaskBoardTitleSchema
>;

export const deleteOrganizationTaskBoardSchema = z.object({
  organizationTaskBoardId: z.cuid(),
});
export type DeleteOrganizationTaskBoardArgs = z.infer<
  typeof deleteOrganizationTaskBoardSchema
>;

export const retrieveAllOrganizationBoardsWithTasksSchema = z.object({
  organizationId: z.cuid(),
});
export type RetrieveAllOrganizationBoardsWithTasksArgs = z.infer<
  typeof retrieveAllOrganizationBoardsWithTasksSchema
>;

// Tasks
export const createTaskSchema = z.object({
  organizationId: z.cuid(),
  description: z.string().min(1),
  dueDate: z.coerce.date().nullable(),
});
export type CreateTaskArgs = z.infer<typeof createTaskSchema>;

export const retrieveTaskInfoSchema = z.object({
  taskId: z.cuid(),
});
export type RetrieveTaskInfoArgs = z.infer<typeof retrieveTaskInfoSchema>;

export const retrieveTaskQuestionsSchema = z.object({
  taskId: z.cuid(),
});
export type RetrieveTaskQuestionsArgs = z.infer<
  typeof retrieveTaskQuestionsSchema
>;

export const updateTaskInfoSchema = z.object({
  taskId: z.cuid(),
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  dueDate: z.coerce.date().nullable(),
});
export type UpdateTaskInfoArgs = z.infer<typeof updateTaskInfoSchema>;

export const deleteTaskByIdSchema = z.object({
  taskId: z.cuid(),
});
export type DeleteTaskByIdArgs = z.infer<typeof deleteTaskByIdSchema>;

// Questions
export const createTaskQuestionSchema = z.object({
  taskId: z.cuid(),
  question: z.string().min(1).max(2000),
  userId: z.cuid(),
});
export type CreateTaskQuestionArgs = z.infer<typeof createTaskQuestionSchema>;

export const deleteTaskQuestionSchema = z.object({
  questionId: z.cuid(),
  userId: z.cuid(),
});
export type DeleteTaskQuestionArgs = z.infer<typeof deleteTaskQuestionSchema>;
