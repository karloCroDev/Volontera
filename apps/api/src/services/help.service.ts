// External packages
import OpenAI from "openai";

// Config
import { prisma } from "@/config/prisma";

// Schemas
import { helpConversationSchema } from "@repo/schemas/help";

export async function helpConversationService({
  rawData,
  userId,
}: {
  rawData: unknown;
  userId: string;
}) {
  const { success, data } = helpConversationSchema.safeParse(rawData);
  if (!success) {
    return {
      status: 400,
      body: {
        title: "Invalid data, cannot send this data",
        message: "Invalid data",
      },
    };
  }

  // Stream the response
  const client = new OpenAI();
  const AIResponse = await client.responses.create({
    model: "gpt-5.1-mini",
    input: data.message,
  });

  const conversation = await prisma.helpConversation.create({
    data: {
      userId,
    },
  });

  await prisma.helpMessage.createMany({
    data: [
      {
        message: data.message,
        senderType: "USER",
        helpId: conversation.id,
      },
      {
        message: AIResponse.output_text,
        senderType: "AI",
        helpId: conversation.id,
      },
    ],
  });
  console.log(AIResponse.output_text);

  return {
    status: 200,
    body: { message: "Message sent successfully" },
  };
}
