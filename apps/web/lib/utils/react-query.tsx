/* eslint-disable @typescript-eslint/no-empty-object-type */

'use client';

// External packages
import * as React from 'react';
import {
	DehydratedState,
	HydrationBoundary,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient();
export const ReactQueryProvider: React.FC<{
	children?: React.ReactNode;
	dehydratedState?: DehydratedState;
}> = ({ children, dehydratedState }) => {
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
