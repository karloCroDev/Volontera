// External packages
import { GenerateContentConfig } from "@google/genai";

// Lib
import { getLlmResponse } from "@/lib/llm-response";

export async function createTasksLlmWithBoard({
  boardTitle,
  description,
}: {
  boardTitle: string;
  description?: string;
}) {
  const schema: GenerateContentConfig["responseSchema"] = {
    description: "A JSON object containing a list of generated tasks.",
    type: "object",
    properties: {
      tasks: {
        type: "array",
        minItems: 1,
        maxItems: 3,
        items: {
          type: "object",
          properties: {
            description: { type: "string" },
            dueDate: {
              type: "string",
              format: "date-time",
              description: "ISO 8601 date-time string",
            },
            title: { type: "string" },
            status: {
              type: "string",
              enum: ["LOW_PRIORITY", "MEDIUM_PRIORITY", "HIGH_PRIORITY"],
            },
          },
          required: ["description", "title", "status", "dueDate"],
        },
      },
    },
    required: ["tasks"],
  };

  const question = `Create a list of specific and actionable tasks for an organization task board.

Board title: "${boardTitle}"
Board description (optional): "${description || ""}"

Return ONLY valid JSON that matches the provided schema.`;

  return await getLlmResponse(question, {
    config: {
      responseSchema: schema,
    },
  });
}
