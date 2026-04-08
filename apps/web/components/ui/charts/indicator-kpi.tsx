// External packages
import * as React from 'react';
import { ChartArea } from 'lucide-react';

// Components
import { Container } from '@/components/ui/container';

export const IndicatorKPI: React.FC<{
	title: string;
	specific: string;
	count: number;
}> = ({ title, specific, count }) => (
	<Container className="min-w-80 rounded-md p-4 shadow">
		<div className="flex justify-between">
			<p>
				{title} <span className="text-muted-foreground ml-2">({specific})</span>
			</p>
			<ChartArea className="text-muted-foreground size-3" />
		</div>

		<p className="text-lg">{count}</p>
	</Container>
);
