'use client';

import { useTheme } from 'next-themes';
// External packages
import * as React from 'react';
import {
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	BarChart as RechartsBarChart,
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
	height = 300,
	color,
}: BarChartProps<T>) => {
	const { theme, resolvedTheme } = useTheme();
	const activeTheme = resolvedTheme ?? theme;

	const [primaryColor, setPrimaryColor] = React.useState<string | null>(null);

	React.useEffect(() => {
		const root = document.documentElement;
		const value = getComputedStyle(root).getPropertyValue('--primary').trim();
		setPrimaryColor(value || null);
	}, [activeTheme]);

	const barFill = color ?? primaryColor ?? '#2563EB';
	return (
		<div style={{ width: '100%', height }}>
			<ResponsiveContainer width="100%" height="100%">
				<RechartsBarChart data={data}>
					<XAxis
						dataKey={String(xKey)}
						tick={{ fill: activeTheme === 'dark' ? '#D1D5DB' : '#6B7280' }}
						axisLine={{
							stroke: activeTheme === 'dark' ? '#4B5563' : '#D1D5DB',
						}}
						tickLine={{
							stroke: activeTheme === 'dark' ? '#4B5563' : '#D1D5DB',
						}}
						tickMargin={10}
					/>
					<YAxis
						tick={{ fill: activeTheme === 'dark' ? '#D1D5DB' : '#6B7280' }}
						axisLine={{
							stroke: activeTheme === 'dark' ? '#4B5563' : '#D1D5DB',
						}}
						tickLine={{
							stroke: activeTheme === 'dark' ? '#4B5563' : '#D1D5DB',
						}}
					/>
					<Tooltip
						contentStyle={{
							backgroundColor: activeTheme === 'dark' ? '#1F2937' : '#FFFFFF',
							border: `1px solid ${activeTheme === 'dark' ? '#374151' : '#E5E7EB'}`,
							borderRadius: '0.5rem',
							color: activeTheme === 'dark' ? '#F9FAFB' : '#111827',
							boxShadow:
								activeTheme === 'dark'
									? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
									: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
						}}
					/>
					<Bar dataKey={String(yKey)} fill={barFill} />
				</RechartsBarChart>
			</ResponsiveContainer>
		</div>
	);
};
