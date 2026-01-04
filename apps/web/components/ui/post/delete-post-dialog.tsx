'use client';

// External packages
import * as React from 'react';

// Components
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDeletePost } from '@/hooks/data/post';
import { toast } from '@/lib/utils/toast';

export const DeletePostDialog: React.FC<{
	postId: string;
}> = ({ postId }) => {
	const { mutate, isPending } = useDeletePost(); // TODO: Handle this so that I don't refetch all posts after deleting one (rn works with revalidation)

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
							{
								postId,
							},
							{
								onSuccess: ({ title, message }) => {
									toast({ title, content: message, variant: 'success' });
									setIsOpen(false);
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
