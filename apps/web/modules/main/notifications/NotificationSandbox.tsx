'use client';

// External pakcages
import * as React from 'react';
import { Form } from 'react-aria-components';

// Components
import { Button } from '@/components/ui/button';
import { CheckboxWithLabel } from '@/components/ui/checkbox';

export const NotificationSandbox = () => {
	return (
		<Form className="border-input-border rounded-xl border py-4">
			<div className="flex items-center justify-between px-6">
				<CheckboxWithLabel
					checkboxVisuallyProps={{
						size: 'lg',
					}}
				>
					Select all
				</CheckboxWithLabel>
				<Button colorScheme="destructive" size="sm" isFullyRounded>
					Delete
				</Button>
			</div>
			<hr className="bg-input-border my-4 h-px w-full border-0" />
		</Form>
	);
};
