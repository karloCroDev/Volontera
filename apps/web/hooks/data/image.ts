// External packages
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

// Lib
import { getImageFromKey } from '@/lib/data/image';

// Schema
import { ImageKeysSchemaArgs } from '@repo/schemas/image';

// Types
import { SuccessfulResponse } from '@repo/types/general';

export const useGetImageFromKey = (
	data: ImageKeysSchemaArgs,
	options?: Omit<
		UseQueryOptions<SuccessfulResponse & { urls: Record<string, string> }>,
		'queryKey' | 'queryFn'
	>
) => {
	return useQuery<
		SuccessfulResponse & {
			urls: Record<string, string>;
		}
	>({
		queryKey: ['get-image-from-keys', data.imageUrls],
		queryFn: () => getImageFromKey(data),
		...options,
	});
};
