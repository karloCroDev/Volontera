// Database
import {
  prisma,
  OrganizationTasksBoards,
  OrganizationTaskInfo,
  OrganizationTaskQuestions,
  OrganizationTask,
} from "@repo/database";

// Boards
export async function createTaskBoard({
  title,
  organizationId,
}: {
  title: OrganizationTasksBoards["title"];

  organizationId: OrganizationTasksBoards["organizationId"];
}) {
  return prisma.organizationTasksBoards.create({
    data: {
      title,
      organizationId,
    },
  });
}

export async function updateOrganizationTaskBoardTitle({
  organizationTaskBoardId,
  title,
}: {
  organizationTaskBoardId: OrganizationTasksBoards["id"];
  title: OrganizationTasksBoards["title"];
}) {
  return prisma.organizationTasksBoards.update({
    where: {
      id: organizationTaskBoardId,
    },
    data: {
      title,
    },
  });
}

export async function deleteOrganizationTaskBoard(
  organizationTaskBoardId: OrganizationTasksBoards["id"]
) {
  return prisma.organizationTasksBoards.deleteMany({
    where: {
      id: organizationTaskBoardId,
    },
  });
}

export async function retrieveAllOrganizationBoards(
  organizationId: OrganizationTasksBoards["organizationId"]
) {
  return prisma.organizationTasksBoards.findMany({
    where: {
      organizationId,
    },
  });
}

// Board with tasks
export async function retrieveAllOrganizationBoardsWithTasks(
  organizationId: OrganizationTasksBoards["organizationId"]
) {
  return prisma.organizationTasksBoards.findMany({
    where: {
      organizationId,
    },
    include: {
      organizationTasks: true,
    },
  });
}

// Tasks
export async function retrieveAllBoardTasks(
  organizationTaskBoardId: OrganizationTasksBoards["id"]
) {
  return prisma.organizationTask.findMany({
    where: {
      organizationTasksBoardId: organizationTaskBoardId,
    },
    // TODO: Get any additional info if needed
    // include: {
    //   organizationTaskInfos: {
    //     select: {

    //     }
    //   }
    // }
  });
}

export async function createTask({
  organizationId,
  description,
  dueDate,
  title,
  organizationTasksBoardId,
}: {
  organizationId: OrganizationTask["organizationId"];
  description: OrganizationTaskInfo["description"];
  dueDate: OrganizationTask["dueDate"];
  title: OrganizationTask["title"];
  organizationTasksBoardId: OrganizationTask["organizationTasksBoardId"];
}) {
  return prisma.organizationTask.create({
    data: {
      organizationId,
      title,
      dueDate,
      organizationTasksBoardId,
      organizationTaskInfos: {
        create: {
          description,
          //   membersAssigned: {
          //     create: {
          //         organization:
          //     }
          //   }
        },
      },
    },
  });
}

export async function retrieveTaskInfo(taskId: OrganizationTask["id"]) {
  return prisma.organizationTaskInfo.findUnique({
    where: {
      organizationTaskId: taskId,
    },
    include: {
      organizationTask: true,
      membersAssigned: true,
    },
  });
}

export async function updateTaskInfo({
  taskId,
  title,
  description,
  dueDate,
}: {
  taskId: OrganizationTask["id"];
  title: OrganizationTask["title"];
  description: OrganizationTaskInfo["description"];
  dueDate: OrganizationTask["dueDate"];
}) {
  return prisma.organizationTaskInfo.update({
    where: {
      organizationTaskId: taskId,
    },
    data: {
      description,
      membersAssigned: {
        // update: {
        //     where: {
        //     }
        // }
      },
      organizationTask: {
        update: {
          dueDate,
          title,
        },
      },
    },
  });
}

export async function deleteTaskById(taskId: OrganizationTask["id"]) {
  console.log("Deleting task with ID:", taskId);
  return prisma.organizationTask.delete({
    where: {
      id: taskId,
    },
  });
}

// Questions
export async function retrieveTaskQuestions(
  taskId: OrganizationTaskQuestions["organizationTaskId"]
) {
  return prisma.organizationTaskQuestions.findMany({
    where: {
      organizationTaskId: taskId,
    },
    include: {
      author: true,
    },
  });
}

export async function createTaskQuestion({
  question,
  taskId,
  userId,
}: {
  taskId: OrganizationTaskQuestions["organizationTaskId"];
  question: OrganizationTaskQuestions["question"];
  userId: OrganizationTaskQuestions["authorId"];
}) {
  return prisma.organizationTaskQuestions.create({
    data: {
      question,
      authorId: userId,
      organizationTaskId: taskId,
    },
  });
}

export async function deleteTaskQuestion({
  questionId,
  userId,
}: {
  questionId: OrganizationTaskQuestions["id"];
  userId: OrganizationTaskQuestions["authorId"];
}) {
  return prisma.organizationTaskQuestions.delete({
    where: {
      id: questionId,
      authorId: userId,
    },
  });
}
