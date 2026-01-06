// External packages
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

// Lib
import { searchUsers } from '@/lib/data/search';

// Schemas
import { SearchUserArgs } from '@repo/schemas/search';

// Types
import { ErrorFormResponse } from '@repo/types/general';
import { SearchResponse } from '@repo/types/search';

export const useSearch = (
	data: SearchUserArgs,
	options?: Omit<
		UseQueryOptions<SearchResponse, ErrorFormResponse>,
		'queryKey' | 'queryFn'
	>
) => {
	return useQuery<SearchResponse, ErrorFormResponse>({
		queryKey: ['search', data.query],
		queryFn: () => searchUsers(data),
		...options,
	});
};
