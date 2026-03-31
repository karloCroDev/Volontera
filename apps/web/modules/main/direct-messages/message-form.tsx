'use client';

// External packages
import * as React from 'react';
import { Send } from 'lucide-react';
import { Form } from 'react-aria-components';
import { useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Components
import { TextEditor } from '@/components/ui/text-editor/text-editor';
import { Button } from '@/components/ui/button';
import { ReplyIndicator } from '@/components/ui/message/reply-indicator';
import {
	ImageItemArgs,
	isLocalImageItem,
} from '@/components/ui/dnd-mapping-images';
import { useMessagesReply } from '@/components/ui/message/reply-context';

// Hooks
import {
	useStartConversationOrStartAndSendDirectMessage,
	useCreateDirectMessageReply,
} from '@/hooks/data/direct-messages';

// Schemas
import {
	messageSchema,
	createReplySchema,
	MessageArgs,
} from '@repo/schemas/direct-messages';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';

export const MessageForm = withReactQueryProvider(() => {
	const searchParams = useSearchParams();
	const { setReplyingTo, replyingTo } = useMessagesReply();

	const { mutate, isPending } =
		useStartConversationOrStartAndSendDirectMessage();
	const { mutate: mutateReply, isPending: isReplyPending } =
		useCreateDirectMessageReply();

	const [images, setImages] = React.useState<ImageItemArgs>([]);
	const isReplying = !!replyingTo;

	const {
		control,
		reset,
		setError,
		formState: { errors, isValid },
		handleSubmit,
	} = useForm<Pick<MessageArgs, 'content'>>({
		resolver: zodResolver(messageSchema.pick({ content: true })),
		defaultValues: {
			content: '',
		},
	});

	const onSettled = () => {
		reset();
		setImages([]);
		setReplyingTo(null);
	};

	const localImages = images.filter(isLocalImageItem);
	const imagePayload = localImages.map(({ contentType, filename, size }) => ({
		contentType,
		filename,
		size,
	}));

	const onSubmit = (formData: Pick<MessageArgs, 'content'>) => {
		const userId = searchParams.get('userId');

		if (!isReplying && !userId) return;

		// Ovako moram handleati reply opciju jer ovisi kojem apiu ću poslati podatke, a oba imaju različite zahtjeve za payload (nije idealno, ali ne vidim jednostavnije rješenje) paa moram testirati zadovoljavajucu zod schemu
		if (isReplying) {
			if (!replyingTo?.id) return;

			const parsedReply = createReplySchema.safeParse({
				content: formData.content,
				parentMessageId: replyingTo.id,
				...(imagePayload.length > 0 ? { images: imagePayload } : {}),
			});

			if (!parsedReply.success) {
				setError('content', {
					type: 'manual',
					message: parsedReply.error.issues[0]?.message || 'Invalid reply data',
				});
				return;
			}

			mutateReply(
				{
					data: parsedReply.data,
					files: localImages.map((img) => img.file),
				},
				{
					onSettled,
				}
			);
		} else {
			const parsedMessage = messageSchema.safeParse({
				content: formData.content,
				particpantId: userId,
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
		}
	};

	return (
		<Form
			className="lg:max-w-3/4 bg-background absolute bottom-4 left-1/2 w-full -translate-x-1/2 rounded-lg px-4 sm:px-6 lg:px-0"
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
									isLoading={isPending || isReplyPending}
									isDisabled={!isValid || !value || isPending || isReplyPending}
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
});
