// Lib
import {
  serverFetchOutput,
  toastResponseOutput,
} from "@/lib/utils/service-output";

// Models
import {
  createTask,
  createTaskBoard,
  createTaskQuestion,
  deleteOrganizationTaskBoard,
  deleteTaskById,
  deleteTaskQuestion,
  moveTaskToBoard,
  retrieveOrganizationMembers,
  retrieveAllBoardTasks,
  retrieveAllOrganizationBoards,
  retrieveAllOrganizationBoardsWithTasks,
  retrieveTaskInfo,
  retrieveTaskQuestions,
  updateOrganizationTaskBoardTitle,
  updateTaskInfo,
} from "@/models/organization-tasks.model";

// Schemas
import {
  CreateTaskArgs,
  CreateTaskBoardArgs,
  CreateTaskQuestionArgs,
  DeleteOrganizationTaskBoardArgs,
  DeleteTaskByIdArgs,
  DeleteTaskQuestionArgs,
  MoveTaskArgs,
  RetrieveAllBoardTasksArgs,
  RetrieveAllBoardTasksQueryArgs,
  RetrieveAllOrganizationBoardsArgs,
  RetrieveAllOrganizationBoardsWithTasksArgs,
  RetrieveTaskInfoArgs,
  RetrieveTaskQuestionsArgs,
  RetrieveOrganizationMembersArgs,
  UpdateOrganizationTaskBoardTitleArgs,
  UpdateTaskInfoArgs,
} from "@repo/schemas/organization-tasks";

// Database
import { User, OrganizationTaskStatus } from "@repo/database";
import { createTasksLlmWithBoard } from "@/lib/structured-llm-response";
import { z } from "zod";

const aiTasksSchema = z.object({
  tasks: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        dueDate: z.string().min(1),
        status: z.enum(["LOW_PRIORITY", "MEDIUM_PRIORITY", "HIGH_PRIORITY"]),
      }),
    )
    .min(1)
    .max(3),
});

// Boards
export async function createTaskBoardService({
  data,
  userId,
}: {
  data: CreateTaskBoardArgs;
  userId: User["id"];
}) {
  let generatedTasks: z.infer<typeof aiTasksSchema>["tasks"] | undefined;

  if (data.generateTasksWithAi) {
    const llmRaw = await createTasksLlmWithBoard({
      boardTitle: data.title,
      description: data.descriptionAi,
    });

    if (typeof llmRaw !== "string") {
      throw new Error("AI task generation failed: invalid response type");
    }

    console.log("LLM RAW:", llmRaw);
    const parsed = aiTasksSchema.parse(llmRaw);
    if (!parsed) {
      throw new Error("AI task generation failed: could not parse tasks JSON");
    }

    generatedTasks = parsed.tasks.map((t) => ({
      title: t.title,
      description: t.description,
      dueDate: t.dueDate,
      status: t.status,
    }));
  }

  await createTaskBoard({
    title: data.title,
    organizationId: data.organizationId,
    authorId: userId,
    tasks: generatedTasks,
  });

  const createdTasksCount = generatedTasks?.length ?? 0;

  return toastResponseOutput({
    status: 200,
    title: "Board Created",
    message:
      createdTasksCount > 0
        ? `Task board created (+${createdTasksCount} AI tasks)`
        : "Task board created successfully",
  });
}

export async function updateOrganizationTaskBoardTitleService(
  data: UpdateOrganizationTaskBoardTitleArgs,
) {
  await updateOrganizationTaskBoardTitle(data);

  return toastResponseOutput({
    status: 200,
    title: "Board Updated",
    message: "Task board title updated successfully",
  });
}

export async function deleteOrganizationTaskBoardService({
  organizationTaskBoardId,
}: DeleteOrganizationTaskBoardArgs) {
  await deleteOrganizationTaskBoard(organizationTaskBoardId);

  return toastResponseOutput({
    status: 200,
    title: "Board Deleted",
    message: "Task board deleted successfully",
  });
}

export async function retrieveAllOrganizationBoardsService({
  organizationId,
}: RetrieveAllOrganizationBoardsArgs) {
  const boards = await retrieveAllOrganizationBoards(organizationId);

  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Boards retrieved successfully",
    data: { boards },
  });
}

// Board with tasks
export async function retrieveAllOrganizationBoardsWithTasksService({
  organizationId,
  filter,
  userId,
}: RetrieveAllOrganizationBoardsWithTasksArgs &
  RetrieveAllBoardTasksQueryArgs & { userId: User["id"] }) {
  const boardsWithTasks = await retrieveAllOrganizationBoardsWithTasks({
    organizationId,
    filter,
    userId,
  });

  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Boards with tasks retrieved successfully",
    data: { boardsWithTasks },
  });
}

export async function retrieveOrganizationMembersService({
  organizationId,
}: RetrieveOrganizationMembersArgs) {
  const organizationMembers = await retrieveOrganizationMembers(organizationId);

  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Organization members retrieved successfully",
    data: { organizationMembers },
  });
}

// Tasks
export async function retrieveAllBoardTasksService({
  organizationTaskBoardId,
  filter,
  userId,
}: RetrieveAllBoardTasksArgs &
  RetrieveAllBoardTasksQueryArgs & { userId: string }) {
  const tasks = await retrieveAllBoardTasks({
    organizationTaskBoardId,
    userId,
    filter,
  });
  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Tasks retrieved successfully",
    data: { tasks },
  });
}

export async function createTaskService({
  data,
  userId,
}: {
  data: CreateTaskArgs;
  userId: User["id"];
}) {
  await createTask({
    ...data,
    userId,
  });

  return toastResponseOutput({
    status: 200,
    title: "Task Created",
    message: "Task created successfully",
  });
}

export async function retrieveTaskInfoService({
  taskId,
}: RetrieveTaskInfoArgs) {
  const taskInfo = await retrieveTaskInfo(taskId);

  if (!taskInfo) {
    return serverFetchOutput({
      status: 400,
      success: false,
      message: "Task not found",
    });
  }

  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Task retrieved successfully",
    data: { taskInfo },
  });
}

export async function retrieveTaskQuestionsService({
  taskId,
}: RetrieveTaskQuestionsArgs) {
  const questions = await retrieveTaskQuestions(taskId);

  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Questions retrieved successfully",
    data: { questions },
  });
}

export async function updateTaskInfoService(data: UpdateTaskInfoArgs) {
  await updateTaskInfo(data);

  return toastResponseOutput({
    status: 200,
    title: "Task Updated",
    message: "Task updated successfully",
  });
}

export async function moveTaskService({
  taskId,
  organizationTasksBoardId,
}: MoveTaskArgs) {
  const task = await moveTaskToBoard({ taskId, organizationTasksBoardId });

  return toastResponseOutput({
    status: 200,
    title: `Task: ${task.title} `,
    message: "Task moved successfully",
  });
}

export async function deleteTaskByIdService({ taskId }: DeleteTaskByIdArgs) {
  await deleteTaskById(taskId);

  return toastResponseOutput({
    status: 200,
    title: "Task Deleted",
    message: "Task deleted successfully",
  });
}

// Questions
export async function createTaskQuestionService({
  data,
  userId,
}: {
  data: Omit<CreateTaskQuestionArgs, "userId">;
  userId: User["id"];
}) {
  await createTaskQuestion({
    taskId: data.taskId,
    question: data.question,
    userId,
  });

  return toastResponseOutput({
    status: 200,
    title: "Question Created",
    message: "Question created successfully",
  });
}

export async function deleteTaskQuestionService({
  data,
  userId,
}: {
  data: Omit<DeleteTaskQuestionArgs, "userId">;
  userId: User["id"];
}) {
  await deleteTaskQuestion({
    questionId: data.questionId,
    userId,
  });

  return toastResponseOutput({
    status: 200,
    title: "Question Deleted",
    message: "Question deleted successfully",
  });
}
