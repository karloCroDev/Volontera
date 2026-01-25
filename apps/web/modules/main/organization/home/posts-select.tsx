'use client';

// External packages
import * as React from 'react';

// Components
import { SelectContainer, SelectItem } from '@/components/ui/select';

// Hooks
import { useSetParams } from '@/hooks/utils/useSetParams';

export const PostsSelect = () => {
	const { removeParam, setParams, searchParams } = useSetParams();
	const currentFilter = searchParams.get('filter') ?? 'recommended';
	return (
		<SelectContainer
			defaultValue={'recommended'}
			onValueChange={(value) => {
				switch (value) {
					case 'recommended':
						return removeParam('filter');
					case 'newest':
						return setParams({ filter: 'newest' });
					case 'oldest':
						return setParams({ filter: 'oldest' });
					default:
						return removeParam('filter');
				}
			}}
			value={currentFilter}
		>
			<SelectItem value="recommended">Recommended</SelectItem>
			<SelectItem value="newest">Newest</SelectItem>
			<SelectItem value="oldest">Oldest</SelectItem>
		</SelectContainer>
	);
};
