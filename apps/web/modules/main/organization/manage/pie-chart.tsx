'use client';

// External packages
import * as React from 'react';
import {
	PieChart as RechartsPieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Tooltip,
	DataKey,
} from 'recharts';
import { useTheme } from 'next-themes';

const colors = ['#f59e0b', '#92400e', '#fde68a', '#ef4444'];

export const PieChart: React.FC<{
	data: {
		count: number;
		name: string;
	}[];
	dataKey: DataKey<string>;
}> = ({ data, dataKey }) => {
	const { theme } = useTheme();

	return (
		<ResponsiveContainer aspect={16 / 9} maxHeight={200}>
			<RechartsPieChart>
				<Pie
					data={data}
					label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
					dataKey={dataKey}
				>
					{data &&
						data.map((_, index) => (
							<Cell
								key={`cell-${index}`}
								fill={colors[index % colors.length]}
							/>
						))}
				</Pie>
				<Tooltip
					contentStyle={{
						backgroundColor: theme === 'dark' ? '#262626' : '#f9fafb',
						border: `1px solid ${theme === 'dark' ? '#404040' : '#e5e7eb'}`,
						borderRadius: '0.5rem',
						color: theme === 'dark' ? '#F9FAFB' : '#111827',
						boxShadow:
							theme === 'dark'
								? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
								: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
					}}
					labelStyle={{
						color: theme === 'dark' ? '#F9FAFB' : '#111827',
						fontWeight: '500',
						marginBottom: '4px',
					}}
					itemStyle={{
						color: theme === 'dark' ? '#F9FAFB' : '#111827',
					}}
				/>
			</RechartsPieChart>
		</ResponsiveContainer>
	);
};
