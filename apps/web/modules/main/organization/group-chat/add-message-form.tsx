'use client';

// External packages
import * as React from 'react';
import { Send } from 'lucide-react';
import { Form } from 'react-aria-components';
import { TextEditor } from '@/components/ui/text-editor/text-editor';
import {
	ImageItemArgs,
	isLocalImageItem,
} from '@/components/ui/dnd-mapping-images';
import { Button } from '@/components/ui/button';
import { useCreateOrganizationGroupChatMessage } from '@/hooks/data/organization-group-chat';
// import { useCreateOrganizationGroupChatMessage } from '@/hooks/data/organization-group-chat';

export const AddMessageForm = () => {
	const [value, setValue] = React.useState('');
	const [images, setImages] = React.useState<ImageItemArgs>([]);

	console.log(images);
	const { mutate, isPending } = useCreateOrganizationGroupChatMessage();

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!value) return;
		mutate(
			{
				data: {
					particpantId: '', // Participant ID is not needed for organization group chat
					content: value,
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
				onSuccess: () => {
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
						// isLoading={isPending}
						// isDisabled={!value || isPending}
					>
						<Send />
					</Button>
				}
			/>
		</Form>
	);
};
