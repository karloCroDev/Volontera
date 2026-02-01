import { QueryClient, isServer } from '@tanstack/react-query';

const makeQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				staleTime: isServer ? Infinity : 5 * 60 * 1000, // 5 minutes
			},
		},
	});

let browserQueryClient: QueryClient | undefined;

export const getQueryClient = () => {
	if (isServer) return makeQueryClient();
	if (!browserQueryClient) browserQueryClient = makeQueryClient();
	return browserQueryClient;
};
