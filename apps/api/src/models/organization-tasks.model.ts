// Database
import {
  prisma,
  OrganizationTasksBoards,
  OrganizationTaskInfo,
  OrganizationTaskQuestions,
  OrganizationTask,
  User,
} from "@repo/database";

// Boards
export async function createTaskBoard({
  title,
  organizationId,
  authorId,
  tasks,
}: {
  title: OrganizationTasksBoards["title"];
  organizationId: OrganizationTasksBoards["organizationId"];
  authorId: User["id"];
  tasks?: {
    title: OrganizationTask["title"];
    dueDate: OrganizationTask["dueDate"];
    status: OrganizationTask["status"];
    description: OrganizationTaskInfo["description"];
  }[];
}) {
  if (!tasks?.length) {
    return prisma.organizationTasksBoards.create({
      data: {
        title,
        organizationId,
      },
    });
  }

  return prisma.organizationTasksBoards.create({
    data: {
      title,
      organizationId,
      organizationTasks: {
        create: tasks.map((task) => ({
          organizationId,
          authorId,
          title: task.title,
          dueDate: task.dueDate,
          status: task.status,
          organizationTaskInfos: {
            create: {
              description: task.description,
            },
          },
        })),
      },
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
  organizationTaskBoardId: OrganizationTasksBoards["id"],
) {
  return prisma.organizationTasksBoards.deleteMany({
    where: {
      id: organizationTaskBoardId,
    },
  });
}

export async function retrieveAllOrganizationBoards(
  organizationId: OrganizationTasksBoards["organizationId"],
) {
  return prisma.organizationTasksBoards.findMany({
    where: {
      organizationId,
    },
  });
}

// Board with tasks
export async function retrieveAllOrganizationBoardsWithTasks({
  organizationId,
  filter,
  userId,
}: {
  organizationId: OrganizationTasksBoards["organizationId"];
  filter?: "your-tasks" | "assigned-by-you";
  userId: User["id"];
}) {
  switch (filter) {
    case "your-tasks":
      return prisma.organizationTasksBoards.findMany({
        where: {
          organizationId,
        },
        include: {
          organizationTasks: {
            where: {
              organizationTaskInfos: {
                is: {
                  organizatonMembersAsiggnedToTaskCards: {
                    some: {
                      organizationMember: {
                        userId,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
    case "assigned-by-you":
      return prisma.organizationTasksBoards.findMany({
        where: {
          organizationId,
        },
        include: {
          organizationTasks: {
            where: {
              authorId: userId,
            },
          },
        },
      });
    default:
      return prisma.organizationTasksBoards.findMany({
        where: {
          organizationId,
        },
        include: {
          organizationTasks: true,
        },
      });
  }
}

// Tasks
export async function retrieveAllBoardTasks({
  organizationTaskBoardId,
  userId,
  filter,
}: {
  organizationTaskBoardId: OrganizationTasksBoards["id"];
  userId: User["id"];
  filter?: "your-tasks" | "assigned-by-you";
}) {
  switch (filter) {
    case "your-tasks":
      return prisma.organizationTask.findMany({
        where: {
          organizationTasksBoardId: organizationTaskBoardId,
          organizationTaskInfos: {
            is: {
              organizatonMembersAsiggnedToTaskCards: {
                some: {
                  organizationMember: {
                    userId,
                  },
                },
              },
            },
          },
        },
      });
    case "assigned-by-you":
      return prisma.organizationTask.findMany({
        where: {
          organizationTasksBoardId: organizationTaskBoardId,
          authorId: userId,
        },
      });
    default:
      return prisma.organizationTask.findMany({
        where: {
          organizationTasksBoardId: organizationTaskBoardId,
        },
      });
  }
}

export async function retrieveOrganizationMembers(organizationId: string) {
  return prisma.organizationMember.findMany({
    where: {
      organizationId,
    },
    include: {
      user: true,
    },
  });
}

export async function createTask({
  organizationId,
  description,
  dueDate,
  title,
  organizationTasksBoardId,
  assignedMembers,
  userId,
  priority,
}: {
  organizationId: OrganizationTask["organizationId"];
  description: OrganizationTaskInfo["description"];
  dueDate: OrganizationTask["dueDate"];
  title: OrganizationTask["title"];
  assignedMembers: string[];
  organizationTasksBoardId: OrganizationTask["organizationTasksBoardId"];
  userId: User["id"];
  priority: OrganizationTask["status"];
}) {
  const assignedMembersData = assignedMembers.map((memberId) => ({
    organizationMemberId: memberId,
  }));

  return prisma.organizationTask.create({
    data: {
      status: priority,
      authorId: userId,
      organizationId,
      title,
      dueDate,
      organizationTasksBoardId,
      organizationTaskInfos: {
        create: {
          description,
          organizatonMembersAsiggnedToTaskCards: {
            ...(assignedMembersData.length
              ? {
                  createMany: {
                    data: assignedMembersData,
                  },
                }
              : {}),
          },
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
      organizatonMembersAsiggnedToTaskCards: {
        include: {
          organizationMember: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });
}

export async function updateTaskInfo({
  taskId,
  title,
  description,
  dueDate,
  assignedMembers,
}: {
  assignedMembers: string[];
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
      organizatonMembersAsiggnedToTaskCards: {
        deleteMany: {},

        createMany: {
          data: assignedMembers.map((memberId) => ({
            organizationMemberId: memberId,
          })),
        },
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

export async function moveTaskToBoard({
  taskId,
  organizationTasksBoardId,
}: {
  taskId: OrganizationTask["id"];
  organizationTasksBoardId: OrganizationTask["organizationTasksBoardId"];
}) {
  return prisma.organizationTask.update({
    where: {
      id: taskId,
    },
    data: {
      organizationTasksBoardId,
    },
  });
}

export async function deleteTaskById(taskId: OrganizationTask["id"]) {
  return prisma.organizationTask.delete({
    where: {
      id: taskId,
    },
  });
}

// Questions
export async function retrieveTaskQuestions(
  taskId: OrganizationTaskQuestions["organizationTaskId"],
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
