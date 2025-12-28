'use client';

// External packages
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { twJoin } from 'tailwind-merge';

// Ako budem ikako fetchao poruke na serveru, onda ovo nije loša stvar
export const MessageWrapper: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const searchParams = useSearchParams();

	const isActive = searchParams.get('user');

	return (
		<div
			className={twJoin('flex w-full flex-col', !isActive && 'hidden lg:flex')}
		>
			{children}
		</div>
	);
};
