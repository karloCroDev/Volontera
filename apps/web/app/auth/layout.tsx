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

	console.log(user);
	if (user.success && user.onboardingFinished) redirect('/home');
	if (user.success && !user.onboardingFinished)
		redirect('/onboarding/app-type');

	return children;
}
