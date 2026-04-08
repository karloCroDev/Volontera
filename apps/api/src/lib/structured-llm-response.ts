// External packages
import { zodToJsonSchema } from "zod-to-json-schema";
import { aiTaskSchema, aiTasksSchema } from "@repo/schemas/ai";

// Lib
import { getLlmResponse } from "@/lib/llm-response";

// Strogo definirana zod schema kako bi dobili strukturirani odgovor od LLM-a koji se može direktno parsirati i koristiti u aplikaciji
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
      responseJsonSchema: zodToJsonSchema(aiTaskSchema as unknown as any),
    },
  });

  const parsedResponse = aiTaskSchema.parse(JSON.parse(response));
  return parsedResponse;
}
