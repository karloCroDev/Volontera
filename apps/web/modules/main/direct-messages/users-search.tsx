'use client';

// External packages
import * as React from 'react';

// Components
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export const UsersSearch = () => {
	return (
		<Input
			label="Search for conversation"
			className="mb-4"
			iconLeft={<Search className="size-4" />}
		/>
	);
};
