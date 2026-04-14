// External packages
import { redirect } from 'next/navigation';

// Components
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';
import { Volontera } from '@/components/ui/volonotera';

// Modules
import { ProgressTracker } from '@/modules/onboarding/progress-tracker';

// Lib
import { getSession } from '@/lib/server/user';

// Karlo: TODO: Mobile view not the prettiest one!
export default async function OnboardingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getSession();
	if (!user.success) redirect('/auth/login');
	if (user.success && user.onboardingFinished) redirect('/home');

	return (
		<Layout className="place-content-center px-4 lg:h-screen">
			<LayoutColumn
				start={1}
				end={{ base: 13, lg: 6 }}
				className="order-2 lg:order-none"
			>
				<ProgressTracker />
			</LayoutColumn>
			<LayoutColumn
				start={{ base: 1, lg: 7 }}
				end={13}
				className="order-1 mt-32 lg:order-none lg:mt-0"
			>
				{children}
			</LayoutColumn>

			<div className="border-b-input-border h-22 absolute left-0 top-0 flex w-full items-center border-b pl-6 sm:pl-12 lg:border-0 lg:pl-16">
				<Volontera />
			</div>
		</Layout>
	);
}
