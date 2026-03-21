/* eslint-disable @typescript-eslint/no-empty-object-type */

'use client';

// External packages
import * as React from 'react';
import {
	DehydratedState,
	HydrationBoundary,
	isServer,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';

const makeQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				// Avoid immediate refetch right after hydration.
				staleTime: 1000 * 30,
			},
		},
	});

let browserQueryClient: QueryClient | undefined;

const getQueryClient = () => {
	if (isServer) {
		return makeQueryClient();
	}

	if (!browserQueryClient) {
		browserQueryClient = makeQueryClient();
	}

	return browserQueryClient;
};

export const ReactQueryProvider: React.FC<{
	children?: React.ReactNode;
	dehydratedState?: DehydratedState;
}> = ({ children, dehydratedState }) => {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			{dehydratedState ? (
				<HydrationBoundary state={dehydratedState}>
					{children}
				</HydrationBoundary>
			) : (
				children
			)}
		</QueryClientProvider>
	);
};

export const withReactQueryProvider = <T extends {}>(
	Component: React.FC<T>
) => {
	const WrappedComponent: React.FC<
		T & { dehydratedState?: DehydratedState }
	> = (props) => {
		const { dehydratedState, ...rest } = props;
		return (
			<ReactQueryProvider dehydratedState={dehydratedState}>
				<Component {...(rest as T)} />
			</ReactQueryProvider>
		);
	};

	// Debugging
	WrappedComponent.displayName = `withReactQueryProvider(${Component.displayName || Component.name || 'Component'})`;

	return WrappedComponent;
};
