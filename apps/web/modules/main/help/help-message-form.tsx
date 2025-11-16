'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';
import { Send } from 'lucide-react';

// Components
import { ResizableTextArea } from '@/components/ui/resizable-input';
import { Button } from '@/components/ui/button';

export const HelpMessageForm = () => {
	return (
		<Form className="mt-auto">
			<ResizableTextArea
				label="Enter your question for AI"
				iconsRight={
					<Button type="submit" className="p-2">
						<Send />
					</Button>
				}
			/>
		</Form>
	);
};
