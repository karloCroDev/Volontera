// External packages
import { redirect } from 'next/navigation';

// Components
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';

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

	console.log(user);
	if (!user.success) redirect('/auth/login');
	if (user.success && user.onboardingFinished) redirect('/home');

	return (
		<Layout className="h-screen place-content-center px-4">
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
				className="order-1 lg:order-none"
			>
				{children}
			</LayoutColumn>
		</Layout>
	);
}
