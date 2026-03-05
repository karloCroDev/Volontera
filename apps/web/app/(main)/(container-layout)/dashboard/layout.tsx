// Components
import { Heading } from '@/components/ui/heading';

// Modules
import { DashboardRoutingHeader } from '@/modules/main/dashboard/dashboard-routing-header';

export default async function DashboardLayoutPage() {
	return (
		<>
			<Heading subtitle="All activities inside the organization by users">
				Dashboard
			</Heading>

			<div className="flex gap-4"></div>
			<DashboardRoutingHeader />
		</>
	);
}
