import { dehydrate, QueryClient } from '@tanstack/react-query';

// Modules
import { Heading } from '@/components/ui/heading';
import { GraphCardTemplate } from '@/modules/main/dashboard/graph-card-template';
import { TotalUsersKPI } from '@/modules/main/dashboard/KPI';
import { ListUsers } from '@/modules/main/dashboard/list-users';
import { PeriodSelect } from '@/modules/main/dashboard/period-select';

// Lib
import {
	retrieveDashboardKPIMetrics,
	retrieveDashboardPaginatedUsers,
} from '@/lib/server/dashboard';

// Types
import { DashboardDurationDays } from '@repo/types/dashboard';

// Components
import { PieChart } from '@/components/ui/charts/pie-chart';
import { BarChart } from '@/components/ui/charts/bar-chart';

// Lib
import { getSession } from '@/lib/server/user';
import { redirect } from 'next/navigation';

// Permissons
import { isAdminAccount } from '@repo/permissons/index';

export default async function DashboardPage({
	searchParams,
}: {
	searchParams: Promise<{ durationDays?: string }>;
}) {
	const user = await getSession();

	if (!user.success || !isAdminAccount(user.role)) redirect('/home');

	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ['dashboard', 'users', { offset: 0, limit: 8, filter: null }],
		queryFn: async () => {
			return await retrieveDashboardPaginatedUsers({
				offset: 0,
				limit: 8,
			});
		},
	});
	const dehydratedState = dehydrate(queryClient);

	const resolvedSearchParams = await searchParams;
	const metrics = await retrieveDashboardKPIMetrics({
		durationDays: resolvedSearchParams.durationDays
			? (Number(resolvedSearchParams.durationDays) as DashboardDurationDays)
			: 30,
	});

	console.log(metrics);

	// KPI cards data
	const metricCards = [
		{
			title: 'Total volunteers (standard users)',
			total: metrics.success ? metrics.totalVolunteers : 0,
			seriesKey: 'totalVolunteers' as const,
		},
		{
			title: 'Total organizations',
			total: metrics.success ? metrics.totalOrganizations : 0,
			seriesKey: 'totalOrganizations' as const,
		},
		{
			title: 'Total organizators',
			total: metrics.success ? metrics.totalOrganizators : 0,
			seriesKey: 'totalOrganizators' as const,
		},
	];

	// Graph cards data
	const pieChartData = [
		{
			name: 'Pro users',
			count: metrics.success ? metrics.totalPaidUsers : 0,
		},
		{
			name: 'Non pro users',
			count: metrics.success ? metrics.totalUnpaidUsers : 0,
		},
	];

	const barChartData = [
		{
			name: 'Volunteers (standard users) monthly',
			value: metrics.success ? metrics.usersWithPaidPlan : 0,
		},
		{
			name: 'Volunteers (standard users) yearly',
			value: metrics.success ? metrics.userWithYearlyPaidPlan : 0,
		},
		{
			name: 'Organizators - monthly',
			value: metrics.success ? metrics.organizatorsWithPaidPlan : 0,
		},
		{
			name: 'Organizators - yearly',
			value: metrics.success ? metrics.organizatorsWithYearlyPaidPlan : 0,
		},
	];

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading subtitle="All activities inside the organization by users">
					Dashboard
				</Heading>

				<PeriodSelect />
			</div>

			<div className="mb-4 flex flex-col gap-4 lg:flex-row">
				{metricCards.map((card) => (
					<TotalUsersKPI
						key={card.seriesKey}
						title={card.title}
						total={card.total}
						series={metrics.success ? metrics.kpiSeries : []}
						seriesKey={card.seriesKey}
					/>
				))}
			</div>

			<div className="mb-6 flex flex-col gap-4 lg:flex-row">
				<GraphCardTemplate
					title="PRO vs non PRO volunteers and organizations"
					subtitle="Distribution of volunteers and organizations by PRO status"
				>
					{pieChartData.some((item) => item.count > 0) ? (
						<PieChart data={pieChartData} dataKey="count" />
					) : (
						<p className="text-muted-foreground text-sm">
							No data available for the selected period.
						</p>
					)}
				</GraphCardTemplate>
				<GraphCardTemplate
					title="Volunteers and organizations with specific PRO plan"
					subtitle="Distribution of types of PRO volunteers and organizations by their plan"
				>
					{barChartData.some((item) => item.value > 0) ? (
						<BarChart data={barChartData} xKey="name" yKey="value" />
					) : (
						<p className="text-muted-foreground text-sm">
							No data available for the selected period.
						</p>
					)}
				</GraphCardTemplate>
			</div>
			{/* <DashboardRoutingHeader /> TODO: Ako stignem napraviti reporte onda ovo dodaj sigurno! */}

			<ListUsers dehydratedState={dehydratedState} />
		</>
	);
}
