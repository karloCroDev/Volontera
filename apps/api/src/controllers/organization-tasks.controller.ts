// External packages
import { Request, Response } from "express";

// Services
import {
  createTaskBoardService,
  createTaskQuestionService,
  createTaskService,
  deleteOrganizationTaskBoardService,
  deleteTaskByIdService,
  deleteTaskQuestionService,
  retrieveAllBoardTasksService,
  retrieveAllOrganizationBoardsService,
  retrieveAllOrganizationBoardsWithTasksService,
  retrieveOrganizationMembersService,
  retrieveTaskInfoService,
  retrieveTaskQuestionsService,
  updateOrganizationTaskBoardTitleService,
  updateTaskInfoService,
  moveTaskService,
} from "@/services/organization-tasks.service";

// Schema types
import {
  CreateTaskBoardArgs,
  CreateTaskQuestionArgs,
  CreateTaskArgs,
  DeleteOrganizationTaskBoardArgs,
  DeleteTaskByIdArgs,
  DeleteTaskQuestionArgs,
  RetrieveAllOrganizationBoardsWithTasksArgs,
  RetrieveTaskInfoArgs,
  RetrieveTaskQuestionsArgs,
  RetrieveOrganizationMembersArgs,
  UpdateOrganizationTaskBoardTitleArgs,
  UpdateTaskInfoArgs,
  MoveTaskArgs,
  RetrieveAllBoardTasksArgs,
  RetrieveAllBoardTasksQueryArgs,
  RetrieveAllOrganizationBoardsArgs,
} from "@repo/schemas/organization-tasks";

// Lib
import { handleServerErrorResponse } from "@/lib/utils/error-response";

// Boards
export async function createTaskBoardController(req: Request, res: Response) {
  try {
    const result = await createTaskBoardService(
      req.body as CreateTaskBoardArgs,
    );
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function updateOrganizationTaskBoardTitleController(
  req: Request,
  res: Response,
) {
  try {
    const result = await updateOrganizationTaskBoardTitleService(
      req.body as UpdateOrganizationTaskBoardTitleArgs,
    );
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function deleteOrganizationTaskBoardController(
  req: Request,
  res: Response,
) {
  try {
    const result = await deleteOrganizationTaskBoardService(
      req.params as DeleteOrganizationTaskBoardArgs,
    );
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function retrieveAllOrganizationBoardsController(
  req: Request,
  res: Response,
) {
  try {
    const result = await retrieveAllOrganizationBoardsService(
      req.params as RetrieveAllOrganizationBoardsArgs,
    );
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

// Board with tasks
export async function retrieveAllOrganizationBoardsWithTasksController(
  req: Request,
  res: Response,
) {
  try {
    const result = await retrieveAllOrganizationBoardsWithTasksService({
      ...(req.params as RetrieveAllOrganizationBoardsWithTasksArgs),
      ...(req.query as RetrieveAllBoardTasksQueryArgs),
      userId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function retrieveOrganizationMembersController(
  req: Request,
  res: Response,
) {
  try {
    const result = await retrieveOrganizationMembersService(
      req.params as RetrieveOrganizationMembersArgs,
    );
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

// Tasks
export async function retrieveAllBoardTasksController(
  req: Request,
  res: Response,
) {
  try {
    const result = await retrieveAllBoardTasksService({
      ...(req.params as RetrieveAllBoardTasksArgs),
      ...(req.query as RetrieveAllBoardTasksQueryArgs),
      userId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function createTaskController(req: Request, res: Response) {
  try {
    const result = await createTaskService({
      data: req.body as CreateTaskArgs,
      userId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function retrieveTaskInfoController(req: Request, res: Response) {
  try {
    const result = await retrieveTaskInfoService(
      req.params as RetrieveTaskInfoArgs,
    );
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function retrieveTaskQuestionsController(
  req: Request,
  res: Response,
) {
  try {
    const result = await retrieveTaskQuestionsService(
      req.params as RetrieveTaskQuestionsArgs,
    );
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function updateTaskInfoController(req: Request, res: Response) {
  try {
    const result = await updateTaskInfoService(req.body as UpdateTaskInfoArgs);
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function moveTaskController(req: Request, res: Response) {
  try {
    const result = await moveTaskService(req.body as MoveTaskArgs);
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function deleteTaskByIdController(req: Request, res: Response) {
  try {
    const result = await deleteTaskByIdService(
      req.params as DeleteTaskByIdArgs,
    );
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

// Questions
export async function createTaskQuestionController(
  req: Request,
  res: Response,
) {
  try {
    const body = req.body as Omit<CreateTaskQuestionArgs, "userId">;
    const result = await createTaskQuestionService({
      data: body,
      userId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}

export async function deleteTaskQuestionController(
  req: Request,
  res: Response,
) {
  try {
    const params = req.params as Omit<DeleteTaskQuestionArgs, "userId">;
    const result = await deleteTaskQuestionService({
      data: params,
      userId: req.user.userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    handleServerErrorResponse(res, err);
  }
}
