// External packages
import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "zod";

// Lib
import { getLlmResponse } from "@/lib/llm-response";

// Rađeno po dokumentaciji: https://ai.google.dev/gemini-api/docs/structured-output?example=recipe
const aiOneTaskSchema = z.object({
  title: z.string().min(1).describe("The title of the task"),
  description: z.string().min(1).describe("The description of the task"),
  dueDate: z
    .string()
    .min(1)
    .describe("The due date of the task in format YYYY-MM-DD."),
  status: z.enum(["LOW_PRIORITY", "MEDIUM_PRIORITY", "HIGH_PRIORITY"]),
});

const aiTasksSchema = z.array(aiOneTaskSchema).min(1).max(3);

export async function createTasksLlmWithBoard({
  boardTitle,
  description,
}: {
  boardTitle: string;
  description?: string;
}) {
  const prompt = `Create a list of specific and actionable tasks for an organization task board. Do not create more than 3 tasks. Each task should have a title, description, dueDate (which must be in the future from today ${new Date().toLocaleDateString()}), and status (LOW_PRIORITY, MEDIUM_PRIORITY, HIGH_PRIORITY) as provided in the schema. Make the content to be connectted to the board title and description.
  Board title: "${boardTitle}"
  Board description (if exists): "${description || ""}"
`;

  const response = await getLlmResponse(prompt, {
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(aiTasksSchema as unknown as any),
    },
  });

  const parsedResponse = aiTasksSchema.parse(JSON.parse(response));
  return parsedResponse;
}

export async function createLlmTask({
  taskDescription,
  taskTitle,
}: {
  taskTitle: string;
  taskDescription?: string;
}) {
  const prompt = `Create a specific and actionable task for an organization task board. The task should have a title, description, dueDate (which must be in the future from today ${new Date().toLocaleDateString()}), and status (LOW_PRIORITY, MEDIUM_PRIORITY, HIGH_PRIORITY) as provided in the schema. Here is the title and descripton: Also this is an additional context for the task: "${taskDescription || ""}"
  Task title: "${taskTitle}"
  `;
  const response = await getLlmResponse(prompt, {
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(aiOneTaskSchema as unknown as any),
    },
  });

  const parsedResponse = aiOneTaskSchema.parse(JSON.parse(response));
  return parsedResponse;
}
