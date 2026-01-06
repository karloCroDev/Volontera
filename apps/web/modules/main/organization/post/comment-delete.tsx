'use client';

// External packages
import * as React from 'react';
import { Trash2 } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

// Components
import { Button } from '@/components/ui/button';

// Hooks
import { useDeleteComment } from '@/hooks/data/comment';

// Types
import { PostCommentsResponse } from '@repo/types/comment';

// Lib
import { toast } from '@/lib/utils/toast';

export const CommentDelete: React.FC<{ commentId: string }> = ({
	commentId,
}) => {
	const params = useParams<{ postId: string }>();
	const searchParams = useSearchParams();

	const queryClient = useQueryClient();
	const { mutate: mutateDeleteComment } = useDeleteComment(commentId, {
		onMutate: async () => {
			await queryClient.cancelQueries({
				queryKey: ['comments', params.postId],
			});

			const previousPost = queryClient.getQueryData([
				'comments',
			]) as PostCommentsResponse;

			queryClient.setQueryData(
				['comments', params.postId],
				(oldData: PostCommentsResponse) => {
					if (!oldData) return oldData;
					return {
						...oldData,
						posts: oldData.comments.filter(
							(comment) => commentId !== comment.id
						),
					};
				}
			);

			return { previousPost };
		},

		onError: ({ message, title }, _, context) => {
			queryClient.setQueryData(
				['comments', params.postId],
				context?.previousPost
			);
			toast({
				title,
				content: message,
				variant: 'error',
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['comments', params.postId],
			});
		},
	});
	return (
		<Button
			variant="blank"
			className="text-muted-foreground hover:text-destructive p-0"
			onPress={() =>
				mutateDeleteComment(undefined, {
					onSuccess: () => {
						// Brišem paramtere iz URL-a ako je obrisan komentar koji se trenutno uređuje (npr. ako je kliknut reply i taj korisnik obriše taj komentar onda se može desiti error)
						const params = new URLSearchParams(searchParams.toString());
						params.delete('commentId');
						params.delete('replyTo');
					},
				})
			}
		>
			<Trash2 />
		</Button>
	);
};
