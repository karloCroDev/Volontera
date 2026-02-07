'use client';

// External packages
import { useTheme } from 'next-themes';
import * as React from 'react';
import {
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	BarChart as RechartsBarChart,
	Cell,
} from 'recharts';

type BarChartProps<T extends Record<string, unknown>> = {
	data: T[] | undefined;
	xKey: keyof T;
	yKey: keyof T;
	height?: number;
	color?: string;
};

export const BarChart = <T extends Record<string, unknown>>({
	data,
	xKey,
	yKey,
}: BarChartProps<T>) => {
	const { theme } = useTheme();

	console.log('Rendering BarChart with data:', data);
	return (
		<ResponsiveContainer>
			<RechartsBarChart data={data}>
				<XAxis
					dataKey={String(xKey)}
					tick={{ fill: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}
					axisLine={{
						stroke: theme === 'dark' ? '#4B5563' : '#D1D5DB',
					}}
					tickLine={{
						stroke: theme === 'dark' ? '#4B5563' : '#D1D5DB',
					}}
					tickMargin={10}
				/>
				<YAxis
					tick={{ fill: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}
					axisLine={{
						stroke: theme === 'dark' ? '#4B5563' : '#D1D5DB',
					}}
					tickLine={{
						stroke: theme === 'dark' ? '#4B5563' : '#D1D5DB',
					}}
				/>
				<Tooltip
					cursor={{
						fill:
							theme === 'dark'
								? 'rgba(55, 65, 81, 0.2)'
								: 'rgba(243, 244, 246, 0.5)',
					}}
					contentStyle={{
						backgroundColor: theme === 'dark' ? '#262626' : '#e5e5e5',
						border: `1px solid ${theme === 'dark' ? '#404040' : '#404040'}`,
						borderRadius: '0.5rem',
						color: theme === 'dark' ? '#e5e5e5' : '#262626',
						boxShadow:
							theme === 'dark'
								? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
								: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
					}}
				/>

				<Bar dataKey={String(yKey)}>
					{data &&
						data.map((_, index) => (
							<Cell
								key={`cell-${index}`}
								fill={['#f59e0b', '#92400e'][index % 2]}
							/>
						))}
				</Bar>
			</RechartsBarChart>
		</ResponsiveContainer>
	);
};
