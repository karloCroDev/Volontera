'use client';

// External packages
import * as React from 'react';

// Components
import { SelectContainer, SelectItem } from '@/components/ui/select';

export const HomeSelect = () => {
	return (
		<SelectContainer defaultValue="following">
			<SelectItem value="popular">Popular</SelectItem>
			<SelectItem value="following">Following</SelectItem>
		</SelectContainer>
	);
};
