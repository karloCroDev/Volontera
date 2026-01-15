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
  RetrieveAllBoardTasksArgs,
  RetrieveAllOrganizationBoardsArgs,
  RetrieveAllOrganizationBoardsWithTasksArgs,
  RetrieveTaskInfoArgs,
  RetrieveTaskQuestionsArgs,
  UpdateOrganizationTaskBoardTitleArgs,
  UpdateTaskInfoArgs,
} from "@repo/schemas/organization-tasks";

// Database
import { User } from "@repo/database";

// Boards
export async function createTaskBoardService(data: CreateTaskBoardArgs) {
  await createTaskBoard(data);

  return toastResponseOutput({
    status: 200,
    title: "Board Created",
    message: "Task board created successfully",
  });
}

export async function updateOrganizationTaskBoardTitleService(
  data: UpdateOrganizationTaskBoardTitleArgs
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
}: RetrieveAllOrganizationBoardsWithTasksArgs) {
  const boardsWithTasks =
    await retrieveAllOrganizationBoardsWithTasks(organizationId);

  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Boards with tasks retrieved successfully",
    data: { boardsWithTasks },
  });
}

// Tasks
export async function retrieveAllBoardTasksService({
  organizationTaskBoardId,
}: RetrieveAllBoardTasksArgs) {
  const tasks = await retrieveAllBoardTasks(organizationTaskBoardId);

  return serverFetchOutput({
    status: 200,
    success: true,
    message: "Tasks retrieved successfully",
    data: { tasks },
  });
}

export async function createTaskService(data: CreateTaskArgs) {
  await createTask(data);

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
