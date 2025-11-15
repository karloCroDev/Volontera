'use client';

// External packages
import { Send } from 'lucide-react';

// Components
import { TextEditor } from '@/components/ui/text-editor/text-editor';
import { Button } from '@/components/ui/button';
import { Form } from 'react-aria-components';
import * as React from 'react';

export const MessageForm = () => {
	const [value, setValue] = React.useState('');
	console.log(value);
	return (
		<Form className="lg:max-w-3/4 mx-auto mt-auto w-full">
			<TextEditor
				setValue={setValue}
				label="Enter your message"
				iconsRight={
					<Button type="submit" className="p-2">
						<Send />
					</Button>
				}
			/>
		</Form>
	);
};
