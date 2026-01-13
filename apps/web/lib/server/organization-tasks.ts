// Utils
import { serverFetch } from '@/lib/utils/server-fetch';

// Types
import { ServerHandleResponse } from '@repo/types/general';
import { RetrieveAllOrganizationBoardsWithTasksResponse } from '@repo/types/organization-tasks';

export async function retrieveAllOrganizationBoardsWithTasks(
	organizationId: string
): Promise<
	RetrieveAllOrganizationBoardsWithTasksResponse | ServerHandleResponse<false>
> {
	return await serverFetch({
		url: `organization-tasks/boards-with-tasks/${organizationId}`,
		init: { next: { tags: ['organization-tasks'] }, cache: 'no-store' },
	});
}
