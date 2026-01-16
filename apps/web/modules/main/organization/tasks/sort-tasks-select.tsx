'use client';

// External packages
import * as React from 'react';

// Components
import { SelectContainer, SelectItem } from '@/components/ui/select';

export const SortTasksSelect = () => {
	return (
		<SelectContainer defaultValue="all-tasks">
			<SelectItem itemProps={{ value: 'all-tasks' }} title="All tasks" />
			<SelectItem itemProps={{ value: 'your-tasks' }} title="Your tasks" />
			<SelectItem
				itemProps={{ value: 'assigned-by-you' }}
				title="Assigned by you"
			/>{' '}
		</SelectContainer>
	);
};
