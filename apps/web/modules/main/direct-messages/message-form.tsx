'use client';

// External packages
import * as React from 'react';
import { Send } from 'lucide-react';
import { Form } from 'react-aria-components';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Components
import { TextEditor } from '@/components/ui/text-editor/text-editor';
import { Button } from '@/components/ui/button';
import { ImageItemArgs } from '@/components/ui/dnd-mapping-images';

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
	const [images, setImages] = React.useState<ImageItemArgs>([]);

	console.log(images);
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
					images: images.map(({ contentType, filename, size }) => ({
						contentType,
						filename,
						size,
					})),
				},
				files: images.map((img) => img.file),
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
					setImages([]);
				},
			}
		);
	};

	return (
		<Form
			className="lg:max-w-3/4 mx-auto mt-auto w-full flex-none"
			onSubmit={onSubmit}
		>
			<TextEditor
				images={images}
				setImages={setImages}
				value={value}
				setValue={setValue}
				hasAnImage
				label="Enter your message..."
				iconsRight={
					<Button
						type="submit"
						className="p-2"
						isLoading={isPending}
						isDisabled={!value || isPending}
					>
						<Send />
					</Button>
				}
			/>
		</Form>
	);
});
