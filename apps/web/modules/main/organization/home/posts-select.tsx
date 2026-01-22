'use client';

// External packages
import * as React from 'react';

// Components
import { SelectContainer, SelectItem } from '@/components/ui/select';

export const PostsSelect = () => {
	return (
		<SelectContainer defaultValue={'recommended'}>
			<SelectItem value="recommended">Recommended</SelectItem>
			<SelectItem value="newest">Newest</SelectItem>
			<SelectItem value="oldest">Oldest</SelectItem>
		</SelectContainer>
	);
};
