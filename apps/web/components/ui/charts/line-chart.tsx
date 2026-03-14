'use client';

// External packages
import * as React from 'react';
import {
	LineChart as RechartsLineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import { useTheme } from 'next-themes';
import { ValueType } from 'recharts/types/component/DefaultTooltipContent';

export const LineChart: React.FC<{
	data: unknown[] | undefined;
	xKey: string;
	yKey?: string;
	lineColor?: string;
	yAxisTickFormatter?: (value: ValueType | undefined) => string;
}> = ({
	data,
	xKey,
	yKey,
	lineColor = 'var(--primary)',
	yAxisTickFormatter,
}) => {
	const { theme } = useTheme();
	const isDark = theme === 'dark';

	if (!yKey) {
		return null;
	}

	// Regular line chart for multiple data points
	return (
		<ResponsiveContainer aspect={16 / 9}>
			<RechartsLineChart data={data} margin={{ left: 20 }}>
				<CartesianGrid
					strokeDasharray="3 3"
					stroke={theme === 'dark' ? '#374151' : '#E5E7EB'}
				/>
				<XAxis
					dataKey={xKey}
					tick={{ fill: isDark ? '#D1D5DB' : '#6B7280' }}
					axisLine={{ stroke: isDark ? '#4B5563' : '#D1D5DB' }}
					tickLine={{ stroke: isDark ? '#4B5563' : '#D1D5DB' }}
					tickMargin={10}
				/>
				<YAxis
					tickFormatter={yAxisTickFormatter}
					allowDecimals={false}
					tick={{ fill: isDark ? '#D1D5DB' : '#6B7280' }}
					axisLine={{ stroke: isDark ? '#4B5563' : '#D1D5DB' }}
					tickLine={{ stroke: isDark ? '#4B5563' : '#D1D5DB' }}
				/>

				<Tooltip
					cursor={{
						stroke: isDark ? '#4B5563' : '#E5E7EB',
						strokeWidth: 1,
						fill: isDark ? 'rgba(55, 65, 81, 0.2)' : 'rgba(243, 244, 246, 0.5)',
					}}
					formatter={yAxisTickFormatter ? yAxisTickFormatter : undefined}
					contentStyle={{
						backgroundColor: isDark ? '#262626' : '#f9fafb',
						border: `1px solid ${isDark ? '#404040' : '#e5e7eb'}`,
						borderRadius: '0.5rem',
						color: isDark ? '#F9FAFB' : '#111827',
						boxShadow: isDark
							? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
							: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
					}}
					labelStyle={{
						color: isDark ? '#F9FAFB' : '#111827',
						fontWeight: '500',
						marginBottom: '4px',
					}}
					itemStyle={{
						color: isDark ? '#F9FAFB' : '#111827',
					}}
				/>

				<Line
					type="monotone"
					dataKey={yKey}
					stroke={lineColor}
					activeDot={{
						r: 5,
						fill: lineColor,
						stroke: isDark ? '#1F2937' : '#FFFFFF',
						strokeWidth: 2,
					}}
					strokeWidth={2}
					dot={{
						r: 4,
						fill: lineColor,
						stroke: isDark ? '#1F2937' : '#FFFFFF',
						strokeWidth: 1,
					}}
				/>
			</RechartsLineChart>
		</ResponsiveContainer>
	);
};
