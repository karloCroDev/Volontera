'use client';

// External packages
import * as React from 'react';
import { useSearchParams } from 'next/navigation';

// Ako budem ikako fetchao poruke na serveru, onda ovo nije loša stvar
export const MessageWrapper: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const searchParams = useSearchParams();

	const isActive = searchParams.get('userId');

	return isActive ? (
		<div className="flex flex-1 flex-col overflow-hidden">{children}</div>
	) : (
		<div className="hidden h-full flex-1 flex-col items-center justify-center text-balance px-4 text-center lg:flex">
			<h1 className="text-xl font-medium italic">
				Let&apos;s go. Start new conversation
			</h1>
			<p className="text-muted-foreground">
				or choose a user to start chatting with.
			</p>
		</div>
	);
};
