// Components
import { Heading } from '@/components/ui/heading';
import {
	BarChartExample,
	PieChartExample,
} from '@/modules/main/dashboard/graph-card-template';
import { TotalUsersKPI } from '@/modules/main/dashboard/KPI';

// Modules
import { PeriodSelect } from '@/modules/main/dashboard/period-select';

export default async function DashboardLayoutPage({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
