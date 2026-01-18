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
	retrieveOrganizationMembers,
	retrieveAllOrganizationBoards,
	retrieveAllBoardTasks,
	retrieveTaskInfo,
	retrieveTaskQuestions,
	updateOrganizationTaskBoardTitle,
	updateTaskInfo,
	moveTask,
	createLlmTask,
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
	RetrieveAllBoardTasksQueryArgs,
	RetrieveAllOrganizationBoardsArgs,
	RetrieveOrganizationMembersArgs,
	RetrieveTaskInfoArgs,
	RetrieveTaskQuestionsArgs,
	UpdateOrganizationTaskBoardTitleArgs,
	UpdateTaskInfoArgs,
	MoveTaskArgs,
	CreateLlmTaskArgs,
} from '@repo/schemas/organization-tasks';

// Types
import { ErrorToastResponse, SuccessfulResponse } from '@repo/types/general';
import {
	RetrieveAllBoardTasksResponse,
	RetrieveAllOrganizationBoardsResponse,
	RetrieveOrganizationMembersResponse,
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
		queryKey: [data.organizationId, 'organization-boards'],
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
			await queryClient.invalidateQueries({
				queryKey: [args[1].organizationId, 'organization-boards'],
			});

			await queryClient.invalidateQueries({
				predicate: (query) => {
					return (
						Array.isArray(query.queryKey) &&
						query.queryKey[1] === 'organization-tasks'
					);
				},
			});

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
			await queryClient.invalidateQueries({
				queryKey: [args[1].organizationId, 'organization-boards'],
			});

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
			await queryClient.invalidateQueries({
				queryKey: [args[1].organizationId, 'organization-boards'],
			});

			await options?.onSuccess?.(...args);
		},
	});
};

export const useRetrieveOrganizationMembers = (
	data: RetrieveOrganizationMembersArgs,
	options?: Omit<
		UseQueryOptions<RetrieveOrganizationMembersResponse>,
		'queryKey' | 'queryFn'
	>
) => {
	return useQuery<RetrieveOrganizationMembersResponse>({
		queryKey: ['organization-members', data.organizationId],
		queryFn: () => retrieveOrganizationMembers(data),
		...options,
	});
};

// Tasks
export const useRetrieveAllBoardTasksArgs = (
	data: RetrieveAllBoardTasksArgs & RetrieveAllBoardTasksQueryArgs,
	options?: Omit<
		UseSuspenseQueryOptions<RetrieveAllBoardTasksResponse>,
		'queryKey' | 'queryFn'
	>
) => {
	return useSuspenseQuery<RetrieveAllBoardTasksResponse>({
		queryKey: [
			data.organizationTaskBoardId,
			'organization-tasks',
			data.filter ?? null,
		],
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
			await queryClient.invalidateQueries({
				queryKey: [args[1].organizationTasksBoardId, 'organization-tasks'],
				predicate: (query) => {
					return (
						query.queryKey[0] === args[1].organizationTasksBoardId &&
						query.queryKey[1] === 'organization-tasks'
					);
				},
			});
			await options?.onSuccess?.(...args);
		},
	});
};
export const useCreateLlmTask = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		CreateLlmTaskArgs
	>
) => {
	const queryClient = useQueryClient();
	return useMutation({
		...options,
		mutationKey: ['create-task'],
		mutationFn: (data: CreateLlmTaskArgs) => createLlmTask(data),
		onSuccess: async (...args) => {
			await queryClient.invalidateQueries({
				queryKey: [args[1].organizationTasksBoardId, 'organization-tasks'],
				predicate: (query) => {
					return (
						query.queryKey[0] === args[1].organizationTasksBoardId &&
						query.queryKey[1] === 'organization-tasks'
					);
				},
			});
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
			await queryClient.invalidateQueries({
				queryKey: [args[1].organizationTasksBoardId, 'organization-tasks'],
				predicate: (query) => {
					return (
						query.queryKey[0] === args[1].organizationTasksBoardId &&
						query.queryKey[1] === 'organization-tasks'
					);
				},
			});

			await options?.onSuccess?.(...args);
		},
	});
};

export const useDeleteTaskById = (
	boardId: string,
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
			await queryClient.invalidateQueries({
				queryKey: [boardId, 'organization-tasks'],
				predicate: (query) => {
					return (
						query.queryKey[0] === boardId &&
						query.queryKey[1] === 'organization-tasks'
					);
				},
			});

			await options?.onSuccess?.(...args);
		},
	});
};

export const useMoveTask = (
	options?: UseMutationOptions<
		SuccessfulResponse,
		ErrorToastResponse,
		MoveTaskArgs
	>
) => {
	return useMutation({
		...options,
		mutationKey: ['move-task'],
		mutationFn: (data: MoveTaskArgs) => moveTask(data),
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
				queryKey: ['organization-task-questions', args[1].taskId],
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
				predicate: (query) => {
					return query.queryKey[0] === 'organization-task-questions';
				},
			});
			await options?.onSuccess?.(...args);
		},
	});
};
