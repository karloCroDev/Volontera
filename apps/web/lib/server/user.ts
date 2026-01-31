// Lib
import { serverFetch } from '@/lib/utils/server-fetch';

// Types
import { UserResponse } from '@repo/types/user';
import { ServerHandleResponse } from '@repo/types/general';

export async function getSession(): Promise<
	UserResponse | ServerHandleResponse<false>
> {
	return await serverFetch({
		url: 'user/session',
		init: { cache: 'no-cache' },
	});
}

export async function getUserData(
	userId: string
): Promise<UserResponse | ServerHandleResponse<false>> {
	return await serverFetch({
		url: `user/id/${userId}`,
		init: { cache: 'no-store', next: { tags: ['user'] } },
	});
}
