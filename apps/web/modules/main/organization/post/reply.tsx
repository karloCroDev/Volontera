'use client';

// External packages
import * as React from 'react';
import { Trash2 } from 'lucide-react';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// Hooks
import { useDeleteReply } from '@/hooks/data/comment';

// Lib
import { convertToFullname } from '@/lib/utils/convert-to-fullname';
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { formatTime } from '@/lib/utils/time-adjustments';

// Types
import { PostCommentRepliesResponse } from '@repo/types/comment';

export const Reply: React.FC<{
	reply: PostCommentRepliesResponse['replies'][0];
}> = withReactQueryProvider(({ reply }) => {
	const { mutate } = useDeleteReply({
		commentId: reply.commentId,
		replyId: reply.id,
	});
	return (
		<div className="ml-8 flex items-center gap-4" key={reply.id}>
			<div className="bg-muted-foreground h-full min-h-16 w-px" />
			<div className="flex flex-1 items-center gap-4">
				<Avatar
					imageProps={{
						src: '',
					}}
					colorScheme="gray"
				>
					{convertToFullname({
						firstname: reply.author.firstName || '',
						lastname: reply.author.lastName || '',
					})}
				</Avatar>

				<div>
					<p className="text-muted-foreground text-xs">
						{convertToFullname({
							firstname: reply.author.firstName || '',
							lastname: reply.author.lastName || '',
						})}{' '}
						| {formatTime(new Date(reply.createdAt))}
					</p>
					<p>{reply.content}</p>
				</div>

				<Button
					variant="blank"
					className="text-muted-foreground hover:text-destructive ml-auto self-end p-0 text-sm"
					onPress={() => mutate()}
				>
					<Trash2 />
				</Button>
			</div>
		</div>
	);
});
