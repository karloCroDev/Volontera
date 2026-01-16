'use client';

// External packages
import * as React from 'react';

// Components
import { SelectContainer, SelectItem } from '@/components/ui/select';

export const HomeSelect = () => {
	return (
		<SelectContainer defaultValue="following">
			<SelectItem itemProps={{ value: 'popular' }} title="Popular" />
			<SelectItem itemProps={{ value: 'following' }} title="Following" />
		</SelectContainer>
	);
};
