'use client';

// External packages
import * as React from 'react';
import { useSearchParams } from 'next/navigation';

// Components
import { SelectContainer, SelectItem } from '@/components/ui/select';
import { useSetParams } from '@/hooks/utils/useSetParams';

export const SortTasksSelect = () => {
	const { removeParam, setParams } = useSetParams();
	const searchParams = useSearchParams();
	const currentFilter = searchParams.get('filter') ?? 'all-tasks';
	return (
		<SelectContainer
			value={currentFilter}
			onValueChange={(value) => {
				if (value === 'all-tasks') {
					return removeParam('filter');
				}
				setParams({ filter: value });
			}}
		>
			<SelectItem itemProps={{ value: 'all-tasks' }} title="All tasks" />
			<SelectItem itemProps={{ value: 'your-tasks' }} title="Your tasks" />
			{/* Admins only */}
			<SelectItem
				itemProps={{ value: 'assigned-by-you' }}
				title="Assigned by you"
			/>
		</SelectContainer>
	);
};
