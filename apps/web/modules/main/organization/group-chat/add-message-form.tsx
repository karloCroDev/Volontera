'use client';

// External packages
import * as React from 'react';
import { Send } from 'lucide-react';
import { Form } from 'react-aria-components';
import { useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Components
import { TextEditor } from '@/components/ui/text-editor/text-editor';
import {
	ImageItemArgs,
	isLocalImageItem,
} from '@/components/ui/dnd-mapping-images';
import { Button } from '@/components/ui/button';
import { ReplyIndicator } from '@/components/ui/message/reply-indicator';
import { useMessagesReply } from '@/components/ui/message/reply-context';

// Hooks
import { useCreateOrganizationGroupChatMessage } from '@/hooks/data/organization-group-chat';

// Schemas
import {
	OrganizationChannelMessageArgs,
	organizationChannelMessageSchema,
} from '@repo/schemas/organization-channel-messages';

export const AddMessageForm: React.FC<{
	groupChatId: OrganizationChannelMessageArgs['groupChatId'];
}> = ({ groupChatId }) => {
	const { replyingTo, setReplyingTo } = useMessagesReply();
	const [images, setImages] = React.useState<ImageItemArgs>([]);
	const { mutate, isPending } = useCreateOrganizationGroupChatMessage();
	const isReplying = !!replyingTo;

	const {
		control,
		reset,
		setError,
		formState: { errors, isValid },
		handleSubmit,
	} = useForm<Pick<OrganizationChannelMessageArgs, 'content'>>({
		resolver: zodResolver(
			organizationChannelMessageSchema.pick({ content: true })
		),
		defaultValues: {
			content: '',
		},
	});

	const paras = useParams<{ organizationId: string }>();
	const onSettled = () => {
		reset();
		setImages([]);
		setReplyingTo(null);
	};

	const onSubmit = (
		formData: Pick<OrganizationChannelMessageArgs, 'content'>
	) => {
		const localImages = images.filter(isLocalImageItem);
		const imagePayload = localImages.map(({ contentType, filename, size }) => ({
			contentType,
			filename,
			size,
		}));

		const isReplyingToThisGroupChat =
			replyingTo?.id && replyingTo.conversationId === groupChatId;

		const parsedMessage = organizationChannelMessageSchema.safeParse({
			groupChatId,
			organizationId: paras.organizationId,
			content: formData.content,
			...(isReplyingToThisGroupChat ? { parentMessageId: replyingTo.id } : {}),
			...(imagePayload.length > 0 ? { images: imagePayload } : {}),
		});

		if (!parsedMessage.success) {
			setError('content', {
				type: 'manual',
				message:
					parsedMessage.error.issues[0]?.message || 'Invalid message data',
			});
			return;
		}

		mutate(
			{
				data: parsedMessage.data,
				files: localImages.map((img) => img.file),
			},
			{
				onSettled,
			}
		);
	};

	return (
		<Form
			className="lg:max-w-3/4 bg-background absolute bottom-4 left-1/2 w-full flex-none -translate-x-1/2 rounded-lg"
			onSubmit={handleSubmit(onSubmit)}
		>
			<ReplyIndicator />
			<Controller
				name="content"
				control={control}
				render={({ field: { value, onChange } }) => (
					<>
						<TextEditor
							images={images}
							setImages={setImages}
							value={value}
							setValue={onChange}
							hasAnImage
							label={isReplying ? 'Write a reply...' : 'Enter your message...'}
							iconsRight={
								<Button
									type="submit"
									className="p-2"
									isLoading={isPending}
									isDisabled={!isValid || !value || isPending}
								>
									<Send />
								</Button>
							}
						/>
						{errors.content && (
							<p className="text-destructive mt-1 text-sm">
								{errors.content.message}
							</p>
						)}
					</>
				)}
			/>
		</Form>
	);
};
