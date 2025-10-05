// Components
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';
import { ProgressTracker } from '@modules/onboarding/progress-tracker';

export default async function OnboardingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Layout>
			<LayoutColumn
				start={1}
				end={{ base: 13, lg: 7 }}
				className="mt-10 lg:mt-0"
			>
				<ProgressTracker />
			</LayoutColumn>
			<LayoutColumn start={{ base: 1, lg: 7 }} end={13}>
				{children}
			</LayoutColumn>
		</Layout>
	);
}
