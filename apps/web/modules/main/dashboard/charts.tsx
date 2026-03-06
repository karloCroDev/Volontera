// Components
import { BarChart } from '@/components/ui/charts/bar-chart';
import { PieChart } from '@/components/ui/charts/pie-chart';
import { Container } from '@/components/ui/container';

export const PieChartExample = () => {
	return (
		<Container className="flex flex-1 flex-col rounded-lg px-6 py-5">
			<div className="flex justify-between">
				<div>
					<p className="text-md font-medium">Pro vs non pro users</p>
					<p className="text-muted-foreground mb-4 text-xs">
						Distribution of users by pro status
					</p>
				</div>
			</div>
			<div className="flex aspect-video flex-1 items-center justify-center">
				<PieChart
					data={[
						{ name: 'Pro users', count: 400 },
						{ name: 'Non pro users', count: 1000 },
					]}
					dataKey="count"
				/>
			</div>
		</Container>
	);
};

export const BarChartExample = () => {
	return (
		<Container className="flex flex-1 flex-col rounded-lg px-6 py-5">
			<div className="flex justify-between">
				<div>
					<p className="text-md font-medium">Users with specific plan</p>
					<p className="text-muted-foreground mb-4 text-xs">
						Distribution of users by their plan
					</p>
				</div>
			</div>
			<div className="aspect-video flex-1">
				<BarChart
					data={[
						{
							name: 'Free plan',
							value: 400,
						},
						{
							name: 'Pro plan',
							value: 1000,
						},
					]}
					xKey="name"
					yKey="value"
				/>
			</div>
		</Container>
	);
};
