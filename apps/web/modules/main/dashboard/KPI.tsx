// External packages
import * as React from 'react';

// Components
import { LineChart } from '@/components/ui/charts/line-chart';
import { Container } from '@/components/ui/container';

// TODO: Copy the same layout and then share it accross multiple KPIS
export const TotalUsersKPI = () => {
	return (
		<Container className="flex w-full flex-1 flex-col rounded-lg px-6 py-5">
			<p className="text-md font-medium">Total users</p>

			<div className="flex flex-1 justify-between gap-4">
				<div>
					<p className="text-lg font-semibold">155</p>
					<p className="text-muted-foreground text-sm">
						in the selected period
					</p>
				</div>

				<div className="flex flex-1">
					<div className="ml-auto aspect-video w-full max-w-64">
						<LineChart
							data={[{ name: 'Total users', value: 155 }]}
							xAxisDataKey="name"
							yAxisDataKey="value"
							lineColor="#a1a1aa"
							hideTooltip
						/>
					</div>
				</div>
			</div>
		</Container>
	);
};
