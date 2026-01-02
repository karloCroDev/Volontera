// External packages
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

// Lib
import { getImageFromKey } from '@/lib/data/image';

// Schema
import { ImageKeysSchemaArgs } from '@repo/schemas/image';

// Types
import { SuccessfulResponse } from '@repo/types/general';

export const useGetImageFromKeys = (
	data: ImageKeysSchemaArgs,
	options?: Omit<
		UseQueryOptions<SuccessfulResponse & { urls: Record<string, string> }>,
		'queryFn' | 'queryKey'
	>
) => {
	return useQuery<
		SuccessfulResponse & {
			urls: Record<string, string>;
		}
	>({
		queryKey: [
			'get-image-from-keys',
			data.imageUrls,
			// ...(options?.queryKey || []),
		],
		queryFn: () => getImageFromKey(data),
		...options,
	});
};
