'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';
import { Send } from 'lucide-react';
import { Controller } from 'react-hook-form';

// Components
import { ResizableTextArea } from '@/components/ui/resizable-input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	HelpConversationSchemaArgs,
	helpConversationSchema,
} from '@repo/schemas/help';
import { useAddHelpQuestion } from '@/hooks/data/help';
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { toast } from '@/lib/utils/toast';

export const HelpMessageForm = withReactQueryProvider(() => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<HelpConversationSchemaArgs>({
		resolver: zodResolver(helpConversationSchema),
	});

	const { mutate } = useAddHelpQuestion();
	const onSubmit = (data: HelpConversationSchemaArgs) => {
		mutate(data, {
			onError: (error) => {
				toast({
					title: error.title,
					content: error.message,
					variant: 'error',
				});
			},

			onSuccess: () => {},
		});
	};
	return (
		<Form className="mt-auto" onSubmit={handleSubmit(onSubmit)}>
			<Controller
				name="message"
				control={control}
				render={({ field }) => (
					<ResizableTextArea
						label="Enter your question for AI"
						textAreaProps={field}
						iconsRight={
							<Button type="submit" className="p-2">
								<Send />
							</Button>
						}
						error={errors.message?.message}
					/>
				)}
			/>
		</Form>
	);
});
