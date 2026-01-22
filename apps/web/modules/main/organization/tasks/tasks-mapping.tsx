'use client';

// External packages
import * as React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
	Button as AriaButton,
	DropIndicator,
	GridList,
	GridListItem,
	isTextDropItem,
	useDragAndDrop,
} from 'react-aria-components';
import { GripVertical } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

// Types
import { RetrieveAllOrganizationBoardsWithTasksResponse } from '@repo/types/organization-tasks';

// Components
import { Dialog } from '@/components/ui/dialog';

// Modules
import { TaskCard } from '@/modules/main/organization/tasks/task-card';
import { TaskCardDetails } from '@/modules/main/organization/tasks/task-card-details';

// Hooks
import { useRetrieveAllBoardTasksArgs } from '@/hooks/data/organization-tasks';
import { useMoveTask } from '@/hooks/data/organization-tasks';

// Lib
import { toast } from '@/lib/utils/toast';

type BoardTasksResponse = {
	tasks: RetrieveAllOrganizationBoardsWithTasksResponse['boardsWithTasks'][0]['organizationTasks'];
	success: boolean;
	message: string;
};

type Task =
	RetrieveAllOrganizationBoardsWithTasksResponse['boardsWithTasks'][0]['organizationTasks'][0];

export const TasksMapping: React.FC<{
	tasks: RetrieveAllOrganizationBoardsWithTasksResponse['boardsWithTasks'][0]['organizationTasks'];
	boardId: string;
}> = ({ tasks, boardId }) => {
	const params = useParams<{ organizationId: string }>();
	const searchParams = useSearchParams();
	const filter = searchParams.get('filter') as
		| 'your-tasks'
		| 'assigned-by-you'
		| null;

	const { mutate: mutateMoveTask } = useMoveTask();
	const { data } = useRetrieveAllBoardTasksArgs(
		{
			organizationId: params.organizationId,
			organizationTaskBoardId: boardId,
			...(filter ? { filter } : {}),
		},
		{
			initialData: {
				tasks,
				success: true,
				message: 'Prefetched data',
			},
			initialDataUpdatedAt: 0,
			refetchOnMount: 'always',
		}
	);

	const queryClient = useQueryClient();
	const queryKeyForBoard = React.useCallback(
		(boardKey: string) =>
			[boardKey, 'organization-tasks', filter ?? null] as const,
		[filter]
	);
	const updateBoardCache = (
		boardKey: string,
		updater: (
			oldData: BoardTasksResponse | undefined
		) => BoardTasksResponse | undefined
	) => {
		queryClient.setQueryData<BoardTasksResponse>(
			queryKeyForBoard(boardKey),
			updater
		);
	};

	console.log(tasks);
	// Ova logika za drag and drop je rađena na ovaj način, po preporuci dokumentaciji react-aria-components za drag and drop: https://react-aria.adobe.com/examples/kanban
	const { dragAndDropHooks } = useDragAndDrop<Task>({
		getItems: (_keys, items) => {
			// Ovo je više manje samo da se podese podaci koji se salju prilikom drag and drop-a. Msm da je preglednije nego da se šalje item.id i sl.
			return items.map((item) => ({
				'task-id': item.id,
				'source-board-id': boardId,
			}));
		},
		renderDropIndicator: (target) => {
			return (
				// Ovo je samo da malo pogurne element gdje bi se trebao ubaciti task
				<DropIndicator
					target={target}
					className="drop-target:visible invisible -mx-2 -my-1.5 h-0 -translate-y-[5px]"
				/>
			);
		},
		acceptedDragTypes: ['task-id'],
		getDropOperation: () => 'move',

		// Moram hadleati dva slučaja: reorder unutar istog boarda i insert iz drugog boarda, te također i drop na root (van bilo koje liste)
		onReorder: (e) => {
			if (!e.target?.key) return;

			const keys = Array.from(e.keys);
			const targetKey = e.target.key;
			updateBoardCache(boardId, (oldData) => {
				if (!oldData) return oldData;
				const dropAfter = e.target.dropPosition === 'after';

				const updated = () => {
					const movingSet = new Set(keys);
					const movingItems: Task[] = [];
					const remnaing: Task[] = [];
					oldData.tasks.forEach((item) => {
						if (movingSet.has(item.id)) {
							movingItems.push(item);
						} else {
							remnaing.push(item);
						}
					});
					// Ako nije nađen, vrati originalnu listu
					const targetIndex = remnaing.findIndex(
						(item) => item.id === targetKey
					);

					if (targetIndex === -1) return oldData.tasks;

					// Ovo updata poziciju elementam, tj. reorder unutar iste liste
					const insertIndex = dropAfter ? targetIndex + 1 : targetIndex;
					return [
						...remnaing.slice(0, insertIndex),
						...movingItems,
						...remnaing.slice(insertIndex),
					];
				};

				return { ...oldData, tasks: updated() };
			});
		},
		onInsert: async (e) => {
			const dropped = e.items.filter(isTextDropItem);
			const pairsRaw = await Promise.all(
				dropped.map(async (i) => ({
					taskId: await i.getText('task-id'),
					sourceBoardId: await i.getText('source-board-id'),
				}))
			);
			const pairs = pairsRaw.filter(
				(pair) => !!pair.taskId && !!pair.sourceBoardId
			);
			const taskIds = pairs.map((pair) => pair.taskId);
			const sourceBoardIds = pairs.map((pair) => pair.sourceBoardId);

			// Kada se radi insert iz druge liste, prvo treba uzeti taskove iz te liste
			const taskById = new Map<string, Task>();
			pairs.forEach(({ taskId, sourceBoardId }) => {
				const sourceData = queryClient.getQueryData<BoardTasksResponse>(
					queryKeyForBoard(sourceBoardId)
				);
				const task =
					sourceData?.tasks.find((task) => task.id === taskId) ??
					data?.tasks.find((task) => task.id === taskId);
				if (task) taskById.set(taskId, task);
			});

			// Ažuriraj cache izvornog boarda tako da se uklone ti taskovi (i prikažu korisniku odmah!!!)
			const uniqueSourceBoards = Array.from(new Set(sourceBoardIds));
			uniqueSourceBoards.forEach((sourceBoardId) => {
				updateBoardCache(sourceBoardId, (oldData) => {
					if (!oldData) return oldData;
					return {
						...oldData,
						tasks: oldData.tasks.filter((task) => !taskIds.includes(task.id)),
					};
				});
			});

			// Onda moram handleati insert na novu destinaciju
			updateBoardCache(boardId, (oldData) => {
				const existing = oldData?.tasks ?? [];
				const movedTasks: RetrieveAllOrganizationBoardsWithTasksResponse['boardsWithTasks'][0]['organizationTasks'] =
					[];
				pairs.forEach(({ taskId }) => {
					const task = taskById.get(taskId);
					if (task) {
						movedTasks.push({ ...task, organizationTasksBoardId: boardId });
					}
				});

				const targetKey = e.target?.key as string | undefined;
				if (!targetKey || movedTasks.length === 0) {
					return {
						success: true,
						message: oldData?.message ?? 'Updated',
						tasks: [...existing, ...movedTasks],
					};
				}

				// Slićna logika kao i gore za reorder unutar iste liste, samo što se ovdje prvo uklanjaju taskovi koji se premještaju
				const remaining = existing.filter((task) => !taskIds.includes(task.id));
				const targetIndex = remaining.findIndex(
					(task) => task.id === targetKey
				);
				if (targetIndex === -1) {
					return {
						success: true,
						message: oldData?.message ?? 'Updated',
						tasks: [...remaining, ...movedTasks],
					};
				}
				const insertIndex =
					e.target.dropPosition === 'after' ? targetIndex + 1 : targetIndex;
				return {
					success: true,
					message: oldData?.message ?? 'Updated',
					tasks: [
						...remaining.slice(0, insertIndex),
						...movedTasks,
						...remaining.slice(insertIndex),
					],
				};
			});

			// Za svaki board moram pozvati mutation da se to i backendu odradi
			taskIds.forEach((taskId) => {
				mutateMoveTask(
					{
						organizationId: params.organizationId,
						taskId,
						organizationTasksBoardId: boardId,
					},
					{
						onSuccess: ({ message, title }) => {
							toast({
								title,
								content: message,
								variant: 'success',
							});
						},
						onError: ({ message, title }) => {
							toast({
								content: message,
								title,
								variant: 'error',
							});
						},
					}
				);
			});
		},
		onRootDrop: async (e) => {
			// Ako je dropano na root onda je skoro isti proces
			const dropped = e.items.filter(isTextDropItem);
			const pairsRaw = await Promise.all(
				dropped.map(async (i) => ({
					taskId: await i.getText('task-id'),
					sourceBoardId: await i.getText('source-board-id'),
				}))
			);
			const pairs = pairsRaw.filter((p) => !!p.taskId && !!p.sourceBoardId);
			const taskIds = pairs.map((p) => p.taskId);
			const sourceBoardIds = pairs.map((p) => p.sourceBoardId);

			// Capture tasks before mutating caches.
			const taskById = new Map<string, Task>();
			pairs.forEach(({ taskId, sourceBoardId }) => {
				const sourceData = queryClient.getQueryData<BoardTasksResponse>(
					queryKeyForBoard(sourceBoardId)
				);
				const task =
					sourceData?.tasks.find((t) => t.id === taskId) ??
					data?.tasks.find((t) => t.id === taskId);
				if (task) taskById.set(taskId, task);
			});

			const uniqueSourceBoards = Array.from(new Set(sourceBoardIds));
			uniqueSourceBoards.forEach((sourceBoardId) => {
				updateBoardCache(sourceBoardId, (oldData) => {
					if (!oldData) return oldData;
					return {
						...oldData,
						tasks: oldData.tasks.filter((t) => !taskIds.includes(t.id)),
					};
				});
			});

			updateBoardCache(boardId, (oldData) => {
				const existing = oldData?.tasks ?? [];
				const movedTasks: RetrieveAllOrganizationBoardsWithTasksResponse['boardsWithTasks'][0]['organizationTasks'] =
					[];
				pairs.forEach(({ taskId }) => {
					const task = taskById.get(taskId);
					if (task) {
						movedTasks.push({ ...task, organizationTasksBoardId: boardId });
					}
				});
				return {
					success: true,
					message: oldData?.message ?? 'Updated',
					tasks: [
						...existing.filter((task) => !taskIds.includes(task.id)),
						...movedTasks,
					],
				};
			});

			taskIds.forEach((taskId) => {
				mutateMoveTask(
					{
						organizationId: params.organizationId,
						taskId,
						organizationTasksBoardId: boardId,
					},
					{
						onSuccess: ({ message, title }) => {
							toast({
								title,
								content: message,
								variant: 'success',
							});
						},
						onError: ({ message, title }) => {
							toast({
								content: message,
								title,
								variant: 'error',
							});
						},
					}
				);
			});
		},
	});

	return (
		<GridList
			items={data?.tasks ?? []}
			aria-label="Tasks"
			selectionMode="single"
			dragAndDropHooks={dragAndDropHooks}
			renderEmptyState={() => (
				<div className="flex h-full items-center justify-center">
					<p className="text-muted-foreground text-center">No tasks found.</p>
				</div>
			)}
			className="no-scrollbar flex flex-1 flex-col gap-4 outline-none"
		>
			{(task) => (
				<GridListItem
					id={task.id}
					value={task}
					textValue={task.title}
					className="outline-none"
				>
					<div className="group grid grid-cols-[1fr_auto] items-start gap-2">
						<Dialog
							key={task.id}
							triggerChildren={<TaskCard task={task} />}
							startDesktop={2}
							endDesktop={12}
						>
							<TaskCardDetails taskId={task.id} boardId={boardId} />
						</Dialog>

						<AriaButton
							slot="drag"
							className="group-hover:text-muted-foreground hover:cursor-pointer"
						>
							<GripVertical className="size-4" />
						</AriaButton>
					</div>
				</GridListItem>
			)}
		</GridList>
	);
};
