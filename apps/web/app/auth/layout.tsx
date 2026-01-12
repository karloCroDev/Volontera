// External packages
import { redirect } from 'next/navigation';

// Lib
import { getSession } from '@/lib/server/user';
import { Volontera } from '@/components/ui/volonotera';

export default async function AuthLayout({
	children,
}: {
	children: Readonly<React.ReactNode>;
}) {
	const user = await getSession();

	if (user.success && user.onboardingFinished) redirect('/home');
	if (user.success && !user.onboardingFinished)
		redirect('/onboarding/app-type');

	return (
		<>
			<Volontera className="absolute left-8 top-8 sm:left-12 lg:left-16" />
			<div className="px-4">{children}</div>
		</>
	);
}
