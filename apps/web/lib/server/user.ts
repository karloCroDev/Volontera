// Lib
import { serverFetch } from '@/lib/utils/server-fetch';

// Types
import { UserResponse } from '@repo/types/user';
import { ServerHandleResponse } from '@repo/types/general';

export async function getSession(): Promise<
	| UserResponse
	| (ServerHandleResponse<false> & {
			isBanned?: true; // Specialni scenario koji moram handleati zbog toga što korisnik postoji ali mu je account banned, tako da mu neću dati pristup aplikaciji, ali ću ga preusmjeriti na account banned stranicu umjesto na login stranicu
	  })
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
