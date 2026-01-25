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
  CreateLlmTaskArgs,
} from "@repo/schemas/organization-tasks";

// Database
import { OrganizationTask, User } from "@repo/database";
import {
  createLlmTask,
  createTasksLlmWithBoard,
} from "@/lib/structured-llm-response";
import { violenceRegex } from "@/lib/utils/regex";
import { safetyCheckLlmReponse } from "@/lib/llm-response";
import { isUserOnProPlan } from "@/lib/payment";
import { createNotifications } from "@/models/notification.model";

// Ovo je model samo za notifikacije korisnicima koji su dodijeljeni na task (nakon update ili kreacije)
async function notifyAssignedMembersForTask({
  taskId,
  content,
}: {
  taskId: OrganizationTask["id"];
  content: string;
}) {
  const taskInfo = await retrieveTaskInfo(taskId);

  const assignedUserIds =
    taskInfo?.organizatonMembersAsiggnedToTaskCards.map(
      (assignedMember) => assignedMember.organizationMember.userId,
    ) ?? [];

  await createNotifications(
    assignedUserIds.map((userId) => ({
      userId,
      content,
    })),
  );
}

// Boards
export async function createTaskBoardService({
  data,
  userId,
}: {
  data: CreateTaskBoardArgs;
  userId: User["id"];
}) {
  if (data.generateTasksWithAi) {
    // Ovo ne handleam u middlewaru jer se i dalje salju isti podatci, te nema velikog smisla da budu dva odvojena api-a
    const isUserPro = await isUserOnProPlan(userId);

    if (!isUserPro) {
      return toastResponseOutput({
        status: 400,
        title: "Pro Plan Required",
        message: "Generating tasks with AI requires a Pro plan",
      });
    }

    // 3 linije obrane prije slanja u LLM. Pogledajte apps\api\src\services\help.service.ts za objašnjenje
    const innapropriateContent = toastResponseOutput({
      status: 400,
      message: "Inappropriate content detected",
      title: "Inappropriate content detected",
    });
    if (violenceRegex.test(`${data.descriptionAi} ${data.title}`)) {
      return innapropriateContent;
    }

    const AIGuard = await safetyCheckLlmReponse(
      `${data.descriptionAi} ${data.title}`,
    );

    if (AIGuard === "Y") {
      return innapropriateContent;
    }
  }

  const createLlmTasks = data.generateTasksWithAi
    ? await createTasksLlmWithBoard({
        boardTitle: data.title,
        description: data.descriptionAi,
      })
    : undefined;

  await createTaskBoard({
    title: data.title,
    organizationId: data.organizationId,
    authorId: userId,
    tasks: createLlmTasks,
  });

  const createdTasksCount = createLlmTasks?.length ?? 0;

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
  const task = await createTask({
    ...data,
    userId,
  });

  await notifyAssignedMembersForTask({
    taskId: task.id,
    content: `You've been assigned to a task: ${data.title}`,
  });

  return toastResponseOutput({
    status: 200,
    title: "Task Created",
    message: "Task created successfully",
  });
}

export async function createLlmTaskService({
  data,
  userId,
}: {
  data: CreateLlmTaskArgs;
  userId: User["id"];
}) {
  // 3 linije obrane prije slanja u LLM. Pogledajte apps\api\src\services\help.service.ts za objašnjenje
  const innapropriateContent = toastResponseOutput({
    status: 400,
    message: "Inappropriate content detected",
    title: "Inappropriate content detected",
  });

  if (violenceRegex.test(`${data.description} ${data.title}`)) {
    return innapropriateContent;
  }

  const AIGuard = await safetyCheckLlmReponse(
    `${data.description} ${data.title}`,
  );

  if (AIGuard === "Y") {
    return innapropriateContent;
  }

  //////////////////////////////////////////////////////////////////////////
  const llmTask = await createLlmTask({
    taskTitle: data.title,
    taskDescription: data.description,
  });
  const createdTask = await createTask({
    assignedMembers: data.assignedMembers,
    description: llmTask.description,
    dueDate: llmTask.dueDate,
    organizationId: data.organizationId,
    priority: llmTask.status,
    organizationTasksBoardId: data.organizationTasksBoardId,
    title: data.title,
    userId,
  });

  await notifyAssignedMembersForTask({
    taskId: createdTask.id,
    content: `You've been assigned to a task: ${data.title}`,
  });

  return toastResponseOutput({
    status: 200,
    title: "AI Task Created",
    message: "AI Task created successfully",
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

  await notifyAssignedMembersForTask({
    taskId: data.taskId,
    content: `Task updated: ${data.title}`,
  });

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
