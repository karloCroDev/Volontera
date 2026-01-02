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
		init: { cache: 'force-cache', next: { tags: ['session'] } },
	});
}

export async function getUserData(
	userId: string
): Promise<UserResponse | ServerHandleResponse<false>> {
	return await serverFetch({
		url: `user/${userId}`,
		init: { cache: 'no-store', next: { tags: ['user'] } },
	});
}
