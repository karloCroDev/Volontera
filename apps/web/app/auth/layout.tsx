// External packages
import { redirect } from 'next/navigation';

// Lib
import { getSession } from '@/lib/server/user';

export default async function AuthLayout({
	children,
}: {
	children: Readonly<React.ReactNode>;
}) {
	const user = await getSession();

	if (user.success && user.onboardingFinished) redirect('/home');
	if (user.success && !user.onboardingFinished)
		redirect('/onboarding/app-type');

	return children;
}
