// External packages
import * as React from 'react';

// Components
import { LineChart } from '@/components/ui/charts/line-chart';
import { Container } from '@/components/ui/container';

// Types
import { DashboardKPIMetricsResponse } from '@repo/types/dashboard';

export const TotalUsersKPI = ({
	title,
	total,
	series,
	seriesKey,
}: {
	title: string;
	total: number;
	series: DashboardKPIMetricsResponse['kpiSeries'];
	seriesKey: 'totalVolunteers' | 'totalOrganizations' | 'totalOrganizators';
}) => {
	const chartData = series.map((point) => ({
		week: point.week,
		value: point[seriesKey],
	}));

	return (
		<Container className="flex w-full flex-1 flex-col rounded-lg px-6 py-5">
			<p className="text-md font-medium">{title}</p>

			<div className="flex flex-1 justify-between gap-4">
				<div>
					<p className="text-lg font-semibold">{total}</p>
					<p className="text-muted-foreground text-sm">
						in the selected period
					</p>
				</div>

				<div className="flex flex-1">
					<div className="ml-auto aspect-video w-full max-w-64">
						<LineChart data={chartData} xKey="week" yKey="value" />
					</div>
				</div>
			</div>
		</Container>
	);
};
