'use client';

// External packages
import * as React from 'react';
import { Send } from 'lucide-react';
import { Form } from 'react-aria-components';
import { useSearchParams } from 'next/navigation';

// Components
import { TextEditor } from '@/components/ui/text-editor/text-editor';
import { Button } from '@/components/ui/button';
import {
	ImageItemArgs,
	isLocalImageItem,
} from '@/components/ui/dnd-mapping-images';

// Hooks
import { useStartConversationOrStartAndSendDirectMessage } from '@/hooks/data/direct-messages';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { IRevalidateTag } from '@/lib/server/revalidation';

export const MessageForm = withReactQueryProvider(() => {
	const searchParams = useSearchParams();

	const [value, setValue] = React.useState('');
	const [images, setImages] = React.useState<ImageItemArgs>([]);

	console.log(images);
	const { mutate, isPending } =
		useStartConversationOrStartAndSendDirectMessage();

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!searchParams.get('userId') || !value) return;

		mutate(
			{
				data: {
					content: value,
					particpantId: searchParams.get('userId') || '',
					images: images
						.filter(isLocalImageItem)
						.map(({ contentType, filename, size }) => ({
							contentType,
							filename,
							size,
						})),
				},
				files: images.filter(isLocalImageItem).map((img) => img.file),
			},
			{
				onSuccess() {
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
			className="lg:max-w-3/4 bg-background absolute bottom-4 left-1/2 w-full flex-none -translate-x-1/2 rounded-lg"
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
