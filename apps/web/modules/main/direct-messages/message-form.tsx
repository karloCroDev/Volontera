'use client';

// External packages
import { Send } from 'lucide-react';
import * as React from 'react';
import { Form } from 'react-aria-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Components
import { TextEditor } from '@/components/ui/text-editor/text-editor';
import { Button } from '@/components/ui/button';

// Scheams
import { messageSchema, MessageArgs } from '@repo/schemas/direct-messages';

export const MessageForm = () => {
	const [value, setValue] = React.useState('');
	console.log(value);

	// const { handleSubmit } = useForm<MessageArgs>({
	// 	context: zodResolver(messageSchema),
	// 	defaultValues: {
	// 		content: '',
	// 	},
	// });

	// const onSubmit = (data: MessageArgs) => {
	// 	console.log(data);
	// };
	return (
		<Form
			className="lg:max-w-3/4 mx-auto mt-auto w-full flex-none"
			// onSubmit={handleSubmit(onSubmit)}
		>
			<TextEditor
				setValue={setValue}
				hasAnImage
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
