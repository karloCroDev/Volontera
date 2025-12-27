'use client';

// External packages
import * as React from 'react';
import { Send } from 'lucide-react';
import { Form } from 'react-aria-components';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Components
import { TextEditor } from '@/components/ui/text-editor/text-editor';
import { Button } from '@/components/ui/button';

// Scheams

// Hooks
import { useStartConversationOrStartAndSendDirectMessage } from '@/hooks/data/direct-messages';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { toast } from '@/lib/utils/toast';
import { IRevalidateTag } from '@/lib/server/revalidation';

// TODO: Implement the image option
export const MessageForm = withReactQueryProvider(() => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();

	const [value, setValue] = React.useState('');

	const { mutate, isPending } =
		useStartConversationOrStartAndSendDirectMessage();

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!searchParams.get('user') || !value) return;

		mutate(
			{
				data: {
					content: value,
					particpantId: searchParams.get('user') || '',
				},
			},
			{
				onSuccess({ message, title, conversationId }) {
					// Samo kada započinjem novi razgovor
					if (!searchParams.get('conversationId')) {
						const params = new URLSearchParams(searchParams.toString());
						params.set('conversationId', conversationId);
						router.push(pathname + '?' + params.toString());

						toast({
							title,
							content: message,
							variant: 'success',
						});
					}
					IRevalidateTag('direct-messages');
				},
				onSettled() {
					setValue('');
				},
			}
		);
	};

	console.log(value);

	return (
		<Form
			className="lg:max-w-3/4 mx-auto mt-auto w-full flex-none"
			onSubmit={onSubmit}
		>
			<TextEditor
				value={value}
				setValue={setValue}
				hasAnImage
				label="Enter your message..."
				iconsRight={
					<Button
						type="submit"
						className="p-2"
						isDisabled={!value || isPending}
					>
						<Send />
					</Button>
				}
			/>
		</Form>
	);
});
