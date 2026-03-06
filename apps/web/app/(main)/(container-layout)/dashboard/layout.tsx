// Components
import { Heading } from '@/components/ui/heading';
import { TotalUsersKPI } from '@/modules/main/dashboard/KPI';

// Modules
import { PeriodSelect } from '@/modules/main/dashboard/period-select';

export default async function DashboardLayoutPage({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<div className="flex items-center justify-between">
				<Heading subtitle="All activities inside the organization by users">
					Dashboard
				</Heading>

				<PeriodSelect />
			</div>

			<div className="mb-4 flex flex-col gap-4 lg:flex-row">
				{[...Array(3)].map((_, i) => (
					<TotalUsersKPI key={i} />
				))}
			</div>

			<div className="mb-6"></div>
			{/* <DashboardRoutingHeader /> TODO: Ako stignem napraviti reporte onda ovo dodaj sigurno! */}

			{children}
		</>
	);
}
