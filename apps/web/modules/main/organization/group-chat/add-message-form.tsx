'use client';

// External packages
import * as React from 'react';
import { Send } from 'lucide-react';
import { Form } from 'react-aria-components';
import { useParams } from 'next/navigation';

// Components
import { TextEditor } from '@/components/ui/text-editor/text-editor';
import {
	ImageItemArgs,
	isLocalImageItem,
} from '@/components/ui/dnd-mapping-images';
import { Button } from '@/components/ui/button';

// Hooks
import { useCreateOrganizationGroupChatMessage } from '@/hooks/data/organization-group-chat';

// Schemas
import { OrganizationGroupChatMessageArgs } from '@repo/schemas/organization-group-chat';
// import { useCreateOrganizationGroupChatMessage } from '@/hooks/data/organization-group-chat';

export const AddMessageForm: React.FC<{
	groupChatId: OrganizationGroupChatMessageArgs['groupChatId'];
}> = ({ groupChatId }) => {
	const [value, setValue] = React.useState('');
	const [images, setImages] = React.useState<ImageItemArgs>([]);
	const { mutate, isPending } = useCreateOrganizationGroupChatMessage();

	const paras = useParams<{ organizationId: string }>();
	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!value) return;
		mutate(
			{
				data: {
					groupChatId,
					organizationId: paras.organizationId,
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
};
