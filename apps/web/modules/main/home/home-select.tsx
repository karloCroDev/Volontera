'use client';

// External packages
import * as React from 'react';

// Components
import { SelectContainer, SelectItem } from '@/components/ui/select';

// Hooks
import { useSetParams } from '@/hooks/utils/useSetParams';

export const HomeSelect = () => {
	const { removeParam, setParams, searchParams } = useSetParams();
	const currentFilter = searchParams.get('filter') ?? 'popular';
	return (
		<SelectContainer
			defaultValue="following"
			value={currentFilter}
			onValueChange={(value) => {
				if (value === 'popular') {
					return removeParam('filter');
				}
				setParams({ filter: value });
			}}
		>
			<SelectItem value="popular">Popular</SelectItem>
			<SelectItem value="following">Following</SelectItem>
		</SelectContainer>
	);
};
