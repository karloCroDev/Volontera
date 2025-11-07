// External packages
import { redirect } from 'next/navigation';

// Server fetch
import { serverFetch } from '@/config/server-fetch';

// Types
import { SessionSuccessResponse } from '@repo/types/auth';

export default async function AuthLayout({
	children,
}: {
	children: Readonly<React.ReactNode>;
}) {
	const user: SessionSuccessResponse = await serverFetch({
		url: 'auth/session',
		init: {
			cache: 'no-store',
			next: { tags: ['session'] },
		},
	});

	if (user.success) {
		if (user && !user.role) redirect('/onboarding/app-type');
		if (user && user.role) redirect('/home');
	}

	return children;
}
