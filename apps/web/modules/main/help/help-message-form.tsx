'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';
import { Send } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

// Components
import { ResizableTextArea } from '@/components/ui/resizable-input';
import { Button } from '@/components/ui/button';

// Schemas
import {
	HelpConversationSchemaArgs,
	helpConversationSchema,
} from '@repo/schemas/help';

// Hooks
import { useAddHelpQuestion } from '@/hooks/data/help';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { toast } from '@/lib/utils/toast';

// Types
import { HelpConversationSuccess } from '@repo/types/help';
import { DeleteConversationDialog } from '@/modules/main/help/delete-conversation-dialog';

export const HelpMessageForm: React.FC<{
	setMutating: React.Dispatch<React.SetStateAction<boolean>>;
}> = withReactQueryProvider(({ setMutating }) => {
	const { control, handleSubmit, reset } = useForm<HelpConversationSchemaArgs>({
		resolver: zodResolver(helpConversationSchema),
	});

	const queryClient = useQueryClient();

	const { mutate, isPending } = useAddHelpQuestion({
		onMutate: async (newMessage) => {
			await queryClient.cancelQueries({ queryKey: ['help'] });

			const previous = queryClient.getQueryData<HelpConversationSuccess>([
				'help',
			]);

			const optimisticMessage: HelpConversationSuccess['messages'][number] = {
				id: crypto.randomUUID(),
				createdAt: new Date(),
				userId: 'current-user',
				senderType: 'USER',
				content: newMessage.message,
				updatedAt: new Date(),
			};

			queryClient.setQueryData<HelpConversationSuccess>(['help'], (old) =>
				old
					? {
							...old,
							messages: [...old.messages, optimisticMessage],
						}
					: old
			);

			return { previous };
		},

		onError: (error, _, context) => {
			if (context?.previous) {
				queryClient.setQueryData(['help'], context.previous);
			}

			toast({
				title: error.title,
				content: error.message,
				variant: 'error',
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['help'] });
		},
	});

	React.useEffect(() => {
		setMutating(isPending);
	}, [isPending, setMutating]);

	const onSubmit = (data: HelpConversationSchemaArgs) => {
		mutate(data, {
			onSuccess: () => {
				reset();
			},
		});
	};
	return (
		<Form
			className="absolute bottom-4 left-1/2 w-3/4 -translate-x-1/2"
			onSubmit={handleSubmit(onSubmit)}
		>
			<Controller
				name="message"
				control={control}
				render={({ field }) => (
					<ResizableTextArea
						label="Enter your question for AI"
						textAreaProps={field}
						className="bg-background"
						iconsLeft={<DeleteConversationDialog />}
						iconsRight={
							<Button type="submit" className="p-2" isDisabled={isPending}>
								<Send />
							</Button>
						}
					/>
				)}
			/>
		</Form>
	);
});
