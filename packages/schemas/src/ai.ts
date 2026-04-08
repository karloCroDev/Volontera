// External packages
import { z } from "zod";

export const aiTaskPrioritySchema = z.enum([
  "LOW_PRIORITY",
  "MEDIUM_PRIORITY",
  "HIGH_PRIORITY",
]);

export const aiTaskSchema = z.object({
  title: z.string().min(1).describe("The title of the task"),
  description: z.string().min(1).describe("The description of the task"),
  dueDate: z
    .string()
    .min(1)
    .describe("The due date of the task in format YYYY-MM-DD."),
  status: aiTaskPrioritySchema,
});
export type AiTaskSchemaArgs = z.infer<typeof aiTaskSchema>;

export const aiTasksSchema = z.array(aiTaskSchema).min(1).max(3);
export type AiTasksSchemaArgs = z.infer<typeof aiTasksSchema>;

export const safetyCheckLlmResponseOutputSchema = z.enum(["Y", "N"]);
export type SafetyCheckLlmResponseOutputArgs = z.infer<
  typeof safetyCheckLlmResponseOutputSchema
>;

export const getLlmResponseOutputSchema = z.string().min(1);
export type GetLlmResponseOutputArgs = z.infer<
  typeof getLlmResponseOutputSchema
>;
