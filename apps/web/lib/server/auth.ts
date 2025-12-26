// Lib
import { serverFetch } from '@/lib/utils/server-fetch';

// Types
import { SessionSuccessResponse } from '@repo/types/auth';
import { ServerHandleResponse } from '@repo/types/general';

export async function getSession(): Promise<
	SessionSuccessResponse | ServerHandleResponse<false>
> {
	return await serverFetch({
		url: 'user/session',
		init: { cache: 'no-store', next: { tags: ['session'] } },
	});
}
