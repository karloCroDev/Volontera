// External packages
import { organizationIdSchema } from "./organization";
import { z } from "zod";

// Boards
export const createTaskBoardSchema = z
  .object({
    title: z.string().min(1).max(100),
    generateTasksWithAi: z.boolean().optional(),
    descriptionAi: z.string().min(1).max(200).or(z.literal("")).optional(),
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

export const retrieveAllBoardTasksSchema = z
  .object({
    organizationTaskBoardId: z.cuid(),
  })
  .extend(organizationIdSchema.shape);
export type RetrieveAllBoardTasksArgs = z.infer<
  typeof retrieveAllBoardTasksSchema
>;

// Odvojena schema jer sam napravio konfiguraciju middlewarea da ne moze primati i :params i :query u isto vrijeme
export const retrieveAllBoardTasksQuerySchema = z.object({
  filter: z.enum(["your-tasks", "assigned-by-you"]).optional(),
});
export type RetrieveAllBoardTasksQueryArgs = z.infer<
  typeof retrieveAllBoardTasksQuerySchema
>;

export const retrieveAllOrganizationBoardsWithTasksSchema =
  organizationIdSchema;
export type RetrieveAllOrganizationBoardsWithTasksArgs = z.infer<
  typeof retrieveAllOrganizationBoardsWithTasksSchema
>;

export const retrieveAllOrganizationBoardSchema = organizationIdSchema;
export type RetrieveAllOrganizationBoardsArgs = z.infer<
  typeof retrieveAllOrganizationBoardSchema
>;

export const retrieveOrganizationMembersSchema = organizationIdSchema;
export type RetrieveOrganizationMembersArgs = z.infer<
  typeof retrieveOrganizationMembersSchema
>;

// Tasks
export const createTaskSchema = z
  .object({
    description: z.string().min(1),
    title: z.string().min(1),
    dueDate: z.string().min(1, "Due date is required"),
    priority: z.enum(["LOW_PRIORITY", "MEDIUM_PRIORITY", "HIGH_PRIORITY"]),
    assignedMembers: z
      .array(z.string())
      .min(1, "At least one member must be assigned"),
    organizationTasksBoardId: z.cuid(),
  })
  .extend(organizationIdSchema.shape);
export type CreateTaskArgs = z.infer<typeof createTaskSchema>;

export const createLlmTaskSchema = createTaskSchema
  .pick({
    title: true,
    organizationTasksBoardId: true,
    assignedMembers: true,
  })
  .extend({
    description: z.string().min(1).or(z.literal("")), // Ai description
    ...organizationIdSchema.shape,
  });
export type CreateLlmTaskArgs = z.infer<typeof createLlmTaskSchema>;

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
    dueDate: z.string().min(1, "Due date is required"),
    assignedMembers: z
      .array(z.string())
      .min(1, "At least one member must be assigned"),
    organizationTasksBoardId: z.cuid(),
  })
  .extend(organizationIdSchema.shape);
export type UpdateTaskInfoArgs = z.infer<typeof updateTaskInfoSchema>;

export const moveTaskSchema = z
  .object({
    taskId: z.cuid(),
    organizationTasksBoardId: z.cuid(),
  })
  .extend(organizationIdSchema.shape);
export type MoveTaskArgs = z.infer<typeof moveTaskSchema>;

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
  })
  .extend(organizationIdSchema.shape);
export type CreateTaskQuestionArgs = z.infer<typeof createTaskQuestionSchema>;

export const deleteTaskQuestionSchema = z
  .object({
    questionId: z.cuid(),
  })
  .extend(organizationIdSchema.shape);
export type DeleteTaskQuestionArgs = z.infer<typeof deleteTaskQuestionSchema>;
