// External packages
import {
	useMutation,
	UseMutationOptions,
	useQuery,
	useQueryClient,
	UseQueryOptions,
	useSuspenseQuery,
	UseSuspenseQueryOptions,
} from '@tanstack/react-query';

// Lib
import {
	createTask,
	createTaskBoard,
	createTaskQuestion,
	deleteOrganizationTaskBoard,
	deleteTaskById,
	deleteTaskQuestion,
	retrieveAllOrganizationBoards,
	retrieveAllBoardTasks,
	retrieveTaskInfo,
	retrieveTaskQuestions,
	updateOrganizationTaskBoardTitle,
	updateTaskInfo,
} from '@/lib/data/organization-tasks';

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

// Types
import { ErrorToastResponse, SuccessfulResponse } from '@repo/types/general';
import {
	RetrieveAllBoardTasksResponse,
	RetrieveAllOrganizationBoardsResponse,
	RetrieveTaskInfoResponse,
	RetrieveTaskQuestionsResponse,
} from '@repo/types/organization-tasks';

// Boards
export const useRetrieveAllOrganizationBoards = (
	data: RetrieveAllOrganizationBoardsArgs,
	options?: Omit<
		UseSuspenseQueryOptions<RetrieveAllOrganizationBoardsResponse>,
		'queryKey' | 'queryFn'
	>
) => {
	return useSuspenseQuery<RetrieveAllOrganizationBoardsResponse>({
		queryKey: ['organization-task-boards', data.organizationId],
		queryFn: () => retrieveAllOrganizationBoards(data),
		...options,
	});
};

export const useCreateTaskBoard = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		CreateTaskBoardArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		...options,
		mutationKey: ['create-task-board'],
		mutationFn: (data: CreateTaskBoardArgs) => createTaskBoard(data),
		onSuccess: async (...args) => {
			const variables = args[1] as CreateTaskBoardArgs | undefined;
			if (variables?.organizationId) {
				await queryClient.invalidateQueries({
					queryKey: ['organization-task-boards', variables.organizationId],
				});
			} else {
				await queryClient.invalidateQueries({
					queryKey: ['organization-task-boards'],
					exact: false,
				});
			}
			await options?.onSuccess?.(...args);
		},
	});
};

export const useUpdateOrganizationTaskBoardTitle = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		UpdateOrganizationTaskBoardTitleArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		...options,
		mutationKey: ['update-task-board-title'],
		mutationFn: (data: UpdateOrganizationTaskBoardTitleArgs) =>
			updateOrganizationTaskBoardTitle(data),
		onSuccess: async (...args) => {
			const variables = args[1] as
				| UpdateOrganizationTaskBoardTitleArgs
				| undefined;
			if (variables?.organizationId) {
				await queryClient.invalidateQueries({
					queryKey: ['organization-task-boards', variables.organizationId],
				});
			} else {
				await queryClient.invalidateQueries({
					queryKey: ['organization-task-boards'],
					exact: false,
				});
			}
			await options?.onSuccess?.(...args);
		},
	});
};

export const useDeleteOrganizationTaskBoard = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		DeleteOrganizationTaskBoardArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		...options,
		mutationKey: ['delete-task-board'],
		mutationFn: (data: DeleteOrganizationTaskBoardArgs) =>
			deleteOrganizationTaskBoard(data),
		onSuccess: async (...args) => {
			const variables = args[1] as DeleteOrganizationTaskBoardArgs | undefined;
			if (variables?.organizationId) {
				await queryClient.invalidateQueries({
					queryKey: ['organization-task-boards', variables.organizationId],
				});
			} else {
				await queryClient.invalidateQueries({
					queryKey: ['organization-task-boards'],
					exact: false,
				});
			}
			await options?.onSuccess?.(...args);
		},
	});
};

// Tasks
export const useRetrieveAllBoardTasksArgs = (
	data: RetrieveAllBoardTasksArgs,
	options?: Omit<
		UseSuspenseQueryOptions<RetrieveAllBoardTasksResponse>,
		'queryKey' | 'queryFn'
	>
) => {
	return useSuspenseQuery<RetrieveAllBoardTasksResponse>({
		queryKey: ['organization-tasks', data.organizationTaskBoardId],
		queryFn: () => retrieveAllBoardTasks(data),
		...options,
	});
};

export const useCreateTask = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		CreateTaskArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		...options,
		mutationKey: ['create-task'],
		mutationFn: (data: CreateTaskArgs) => createTask(data),
		onSuccess: async (...args) => {
			const variables = args[1] as CreateTaskArgs | undefined;
			if (variables?.organizationId) {
				await queryClient.invalidateQueries({
					queryKey: ['organization-task-boards', variables.organizationId],
				});
			} else {
				await queryClient.invalidateQueries({
					queryKey: ['organization-task-boards'],
					exact: false,
				});
			}
			await options?.onSuccess?.(...args);
		},
	});
};

export const useRetrieveTaskInfo = (
	data: RetrieveTaskInfoArgs,
	options?: Omit<
		UseQueryOptions<RetrieveTaskInfoResponse>,
		'queryKey' | 'queryFn'
	>
) => {
	return useQuery<RetrieveTaskInfoResponse>({
		queryKey: ['organization-task-info', data.taskId],
		queryFn: () => retrieveTaskInfo(data),
		...options,
	});
};

export const useRetrieveTaskQuestions = (
	data: RetrieveTaskQuestionsArgs,
	options?: Omit<
		UseQueryOptions<RetrieveTaskQuestionsResponse>,
		'queryKey' | 'queryFn'
	>
) => {
	return useQuery<RetrieveTaskQuestionsResponse>({
		queryKey: ['organization-task-questions', data.taskId],
		queryFn: () => retrieveTaskQuestions(data),
		...options,
	});
};

export const useUpdateTaskInfo = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		UpdateTaskInfoArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		...options,
		mutationKey: ['update-task-info'],
		mutationFn: (data: UpdateTaskInfoArgs) => updateTaskInfo(data),
		onSuccess: async (...args) => {
			const variables = args[1] as UpdateTaskInfoArgs | undefined;
			if (variables?.organizationId) {
				await queryClient.invalidateQueries({
					queryKey: ['organization-task-boards', variables.organizationId],
				});
			}
			if (variables?.taskId) {
				await queryClient.invalidateQueries({
					queryKey: ['organization-task-info', variables.taskId],
				});
			}
			await options?.onSuccess?.(...args);
		},
	});
};

export const useDeleteTaskById = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		DeleteTaskByIdArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		...options,
		mutationKey: ['delete-task'],
		mutationFn: (data: DeleteTaskByIdArgs) => deleteTaskById(data),
		onSuccess: async (...args) => {
			const variables = args[1] as DeleteTaskByIdArgs | undefined;
			if (variables?.organizationId) {
				await queryClient.invalidateQueries({
					queryKey: ['organization-task-boards', variables.organizationId],
				});
			}
			await queryClient.invalidateQueries({
				queryKey: ['organization-task-info'],
				exact: false,
			});
			await options?.onSuccess?.(...args);
		},
	});
};

// Questions
export const useCreateTaskQuestion = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		CreateTaskQuestionArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		...options,
		mutationKey: ['create-task-question'],
		mutationFn: (data: CreateTaskQuestionArgs) => createTaskQuestion(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['organization-task-questions'],
				exact: false,
			});
			await options?.onSuccess?.(...args);
		},
	});
};

export const useDeleteTaskQuestion = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		DeleteTaskQuestionArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		...options,
		mutationKey: ['delete-task-question'],
		mutationFn: (data: DeleteTaskQuestionArgs) => deleteTaskQuestion(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				queryKey: ['organization-task-questions'],
				exact: false,
			});
			await options?.onSuccess?.(...args);
		},
	});
};
