'use client';

// External packages
import * as React from 'react';

// Components
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDeletePost } from '@/hooks/data/post';
import { toast } from '@/lib/utils/toast';
import { RetrieveOrganizationPostsResponse } from '@repo/types/post';
import { useQueryClient } from '@tanstack/react-query';

export const DeletePostDialog: React.FC<{
	postId: string;
}> = ({ postId }) => {
	const queryClient = useQueryClient();
	const { mutate, isPending } = useDeletePost(postId, {
		onSuccess: () => {
			queryClient.setQueriesData(
				{ queryKey: ['posts'], exact: false }, // Targets any key starting with 'posts'
				(oldData: RetrieveOrganizationPostsResponse | undefined) => {
					if (!oldData) return oldData;
					return {
						...oldData,
						posts: oldData.posts.filter((post) => post.id !== postId),
					};
				}
			);
		},
	});

	const [isOpen, setIsOpen] = React.useState(false);
	return (
		<Dialog
			title="Delete post?"
			triggerChildren={
				<Button variant="outline" colorScheme="destructive" size="xs">
					Delete Post
				</Button>
			}
			isOpen={isOpen}
			onOpenChange={setIsOpen}
		>
			<p className="text-muted-foreground">
				Are you sure you want to delete your post? This action cannot be undone.
			</p>

			<div className="mt-4 flex justify-center gap-4">
				<Button
					colorScheme="destructive"
					onPress={() => {
						mutate(
							{ postId },
							{
								onSuccess: ({ message, title }) => {
									toast({
										title: title,
										content: message,
										variant: 'success',
									});

									setIsOpen(false);
								},
								onError: ({ message, title }) => {
									toast({
										title: title,
										content: message,
										variant: 'error',
									});
								},
							}
						);
					}}
					isLoading={isPending}
					isDisabled={isPending}
				>
					Yes
				</Button>
				<Button colorScheme="bland" variant="outline" slot="close">
					No
				</Button>
			</div>
		</Dialog>
	);
};
