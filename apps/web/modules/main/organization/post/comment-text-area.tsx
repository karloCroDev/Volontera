'use client';

// External packages
import * as React from 'react';
import { Send } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { Form } from 'react-aria-components';

// Components
import { ResizableTextArea } from '@/components/ui/resizable-input';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// Hooks
import { useSession } from '@/hooks/data/user';
import { useCreateComment, useCreateReply } from '@/hooks/data/comment';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { convertToFullname } from '@/lib/utils/convert-to-fullname';

// Types

// Scheams
import {
	createCommentSchema,
	createReplySchema,
	CreateCommentArgs,
	CreateReplyArgs,
} from '@repo/schemas/comment';
import { toast } from '@/lib/utils/toast';

// Types
import { SuccessfulResponse } from '@repo/types/general';
import { zodResolver } from '@hookform/resolvers/zod';

type FormProps = Omit<
	CreateReplyArgs | CreateCommentArgs,
	'commentId' | 'postId'
>;
export const CommentTextArea = withReactQueryProvider(() => {
	const { data: user } = useSession();

	const params = useParams<{ postId: string }>();
	const searchParams = useSearchParams();
	const commentId = searchParams.get('commentId');

	const { mutate: mutateCreateReply, isPending: isCreateReplyPending } =
		useCreateReply();

	const { mutate: mutateCreateComment, isPending: isCreateCommentPending } =
		useCreateComment();

	const {
		handleSubmit,
		control,
		formState: { errors },
		reset,
	} = useForm<FormProps>({
		resolver: commentId
			? zodResolver(createReplySchema.omit({ commentId: true }))
			: zodResolver(createCommentSchema.omit({ postId: true })),
		defaultValues: {
			content: '',
		},
	});

	const onSubmit = (data: FormProps) => {
		const onSuccess = ({ message, title }: SuccessfulResponse) => {
			toast({
				title,
				content: message,
				variant: 'success',
			});

			reset();
		};

		const onError = ({ message, title }: SuccessfulResponse) => {
			toast({
				title,
				content: message,
				variant: 'error',
			});
		};

		if (commentId) {
			mutateCreateReply(
				{
					...data,
					commentId: commentId,
				},
				{
					onSuccess,
					onError,
				}
			);
		} else {
			mutateCreateComment(
				{
					...data,
					postId: params.postId,
				},
				{
					onSuccess,
					onError,
				}
			);
		}
	};

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<Controller
				control={control}
				name="content"
				render={({ field }) => (
					<ResizableTextArea
						textAreaProps={field}
						error={errors.content?.message}
						label={
							commentId
								? `Write a reply to ${searchParams.get('replyTo')}`
								: 'Enter a new comment'
						}
						className="border-input-border mt-12 gap-4 border"
						iconsLeft={
							user && (
								<Avatar
									imageProps={{
										src: user?.image || '',
									}}
									size="sm"
									colorScheme="gray"
									className="mt-4 self-start"
								>
									{convertToFullname({
										firstname: user.firstName,
										lastname: user.lastName,
									})}
								</Avatar>
							)
						}
						iconsRight={
							<Button
								variant="outline"
								colorScheme="yellow"
								type="submit"
								className="mt-4 p-2"
								size="sm"
								isDisabled={isCreateCommentPending || isCreateReplyPending}
								isLoading={isCreateCommentPending || isCreateReplyPending}
							>
								<Send />
							</Button>
						}
					/>
				)}
			/>
		</Form>
	);
});
