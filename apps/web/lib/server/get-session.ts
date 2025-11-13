// Config
import { serverFetch } from '@/config/server-fetch';

// Types
import { SessionSuccessResponse } from '@repo/types/auth';
import { ServerHandleResponse } from '@repo/types/general';

export async function getSession(): Promise<
	SessionSuccessResponse | ServerHandleResponse<false>
> {
	return await serverFetch({
		url: 'auth/session',
		init: { cache: 'no-store', next: { tags: ['session'] } },
	});
}
