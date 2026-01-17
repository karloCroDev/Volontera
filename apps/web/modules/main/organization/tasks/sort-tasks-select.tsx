'use client';

// External packages
import * as React from 'react';
import { useSearchParams } from 'next/navigation';

// Components
import { SelectContainer, SelectItem } from '@/components/ui/select';

// Hooks
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
			<SelectItem value="all-tasks">All tasks</SelectItem>
			<SelectItem value="your-tasks">Your tasks</SelectItem>
			{/* Admins only */}
			<SelectItem value="assigned-by-you">Assigned by you</SelectItem>
		</SelectContainer>
	);
};
