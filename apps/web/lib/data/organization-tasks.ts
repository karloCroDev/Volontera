// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

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
	RetrieveTaskInfoArgs,
	RetrieveTaskQuestionsArgs,
	UpdateOrganizationTaskBoardTitleArgs,
	UpdateTaskInfoArgs,
} from '@repo/schemas/organization-tasks';

// Boards

export async function retrieveAllOrganizationBoards({
	organizationId,
}: RetrieveAllOrganizationBoardsArgs) {
	try {
		const res = await API().get(`/organization-tasks/boards/${organizationId}`);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function createTaskBoard(data: CreateTaskBoardArgs) {
	try {
		const res = await API().post('/organization-tasks/boards/create', data);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function updateOrganizationTaskBoardTitle(
	data: UpdateOrganizationTaskBoardTitleArgs
) {
	try {
		const res = await API().patch(
			'/organization-tasks/boards/update-title',
			data
		);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function deleteOrganizationTaskBoard({
	organizationId,
	organizationTaskBoardId,
}: DeleteOrganizationTaskBoardArgs) {
	try {
		const res = await API().delete(
			`/organization-tasks/boards/${organizationId}/${organizationTaskBoardId}`
		);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

// Tasks
export async function retrieveAllBoardTasks({
	organizationId,
	organizationTaskBoardId,
}: RetrieveAllBoardTasksArgs) {
	try {
		const res = await API().get(
			`/organization-tasks/tasks/${organizationId}/${organizationTaskBoardId}`
		);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function createTask(data: CreateTaskArgs) {
	try {
		const res = await API().post('/organization-tasks/tasks/create', data);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function retrieveTaskInfo({
	organizationId,
	taskId,
}: RetrieveTaskInfoArgs) {
	try {
		const res = await API().get(
			`/organization-tasks/tasks/${organizationId}/${taskId}`
		);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function retrieveTaskQuestions({
	organizationId,
	taskId,
}: RetrieveTaskQuestionsArgs) {
	try {
		const res = await API().get(
			`/organization-tasks/tasks/${organizationId}/${taskId}/questions`
		);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function updateTaskInfo(data: UpdateTaskInfoArgs) {
	try {
		const res = await API().patch('/organization-tasks/tasks/update', data);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function deleteTaskById({
	organizationId,
	taskId,
}: DeleteTaskByIdArgs) {
	try {
		const res = await API().delete(
			`/organization-tasks/tasks/${organizationId}/${taskId}`
		);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

// Questions
export async function createTaskQuestion(data: CreateTaskQuestionArgs) {
	try {
		// API route schema omits `userId` (taken from auth); strip it if present.

		const res = await API().post('/organization-tasks/tasks/question', data);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function deleteTaskQuestion({
	organizationId,
	questionId,
}: DeleteTaskQuestionArgs) {
	try {
		const res = await API().delete(
			`/organization-tasks/tasks/question/${organizationId}/${questionId}`
		);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
