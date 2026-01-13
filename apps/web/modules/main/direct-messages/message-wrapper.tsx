'use client';

// External packages
import * as React from 'react';
import { useSearchParams } from 'next/navigation';

// Ako budem ikako fetchao poruke na serveru, onda ovo nije loša stvar
export const MessageWrapper: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const searchParams = useSearchParams();

	const isActive = searchParams.get('user');

	return (
		<div className="flex w-full flex-col">
			{isActive ? (
				children
			) : (
				<div className="flex h-full flex-1 flex-col items-center justify-center text-balance px-4 text-center">
					<h1 className="text-xl font-medium italic">
						Let&apos; go. Start new conversation
					</h1>
					<p className="text-muted-foreground">
						Choose a user to start chatting with.
					</p>
				</div>
			)}
		</div>
	);
};
