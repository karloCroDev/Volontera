'use client';

// External packages
import * as React from 'react';

// Components
import { SelectContainer, SelectItem } from '@/components/ui/select';

export const PostsSelect = () => {
	return (
		<SelectContainer defaultValue={'recommended'}>
			<SelectItem itemProps={{ value: 'recommended' }} title="Recommended" />
			<SelectItem itemProps={{ value: 'newest' }} title="Newest" />
			<SelectItem itemProps={{ value: 'oldest' }} title="Oldest" />
		</SelectContainer>
	);
};
