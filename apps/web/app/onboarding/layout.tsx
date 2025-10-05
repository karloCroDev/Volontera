// Components
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';

// Modules
import { ProgressTracker } from '@modules/onboarding/progress-tracker';

// Karlo: TODO: Mobile view not the prettiest one!
export default async function OnboardingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Layout className="h-[100vh] place-content-center">
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
