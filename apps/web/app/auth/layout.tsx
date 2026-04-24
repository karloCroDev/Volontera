// External packages
import { redirect } from 'next/navigation';

// Components
import { Volontera } from '@/components/ui/volonotera';
import { Layout } from '@/components/ui/layout-grid';

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

	return (
		<>
			<div className="border-b-input-border absolute left-0 top-8 w-full border-b pb-5 pl-6 sm:pl-12 lg:border-0 lg:pl-16">
				<Volontera />
			</div>{' '}
			<Layout className="mt-32 px-4 lg:mt-0 lg:gap-x-20 xl:gap-x-24">
				{children}
			</Layout>
		</>
	);
}
