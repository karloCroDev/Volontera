// Lib
import { serverFetch } from '@/lib/utils/server-fetch';

// Repo
import { ImageKeysSchemaArgs } from '@repo/schemas/image';

// Types
import { SuccessfulResponse } from '@repo/types/general';

export async function getImageFromKey(data: ImageKeysSchemaArgs) {
	return await serverFetch<
		SuccessfulResponse & { urls: Record<string, string> }
	>({
		url: 'image/get-url-from-keys',
		init: {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			},
			next: { tags: ['image'] },
		},
	});
}
