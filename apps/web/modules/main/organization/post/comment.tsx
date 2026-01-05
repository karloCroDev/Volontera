'use client';

// External packages
import * as React from 'react';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Collapsible } from '@/components/ui/collapsible';
import { Tag } from '@/components/ui/tag';

import {
	ChevronRight,
	Edit,
	Heart,
	Reply as ReplyIcon,
	Trash2,
} from 'lucide-react';
import {
	useParams,
	usePathname,
	useRouter,
	useSearchParams,
} from 'next/navigation';

type CommentOrReplyProps = {
	numberOfLikes: number;
	comment: string;
	// user: SessionSuccessResponse; // Change the type of user when setting the session data
};
export const Comment: React.FC<
	CommentOrReplyProps & {
		numberOfReplies: number;
		// user: SessionSuccessResponse; // Change the type of user when setting the session data
		// commentData: Omit<RetrievePostWithComments, 'post'> & {
		// 	comments: RetrievePostWithComments['post']['postComments'];
		// };
		commentId: string;
	}
> = ({ comment, commentId, numberOfReplies, numberOfLikes }) => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();
	return (
		<div className="border-b-input-border border-b py-4">
			<div className="flex items-center gap-4">
				<Avatar
					imageProps={{
						src: '',
					}}
					colorScheme="gray"
				>
					Ana Horvat
				</Avatar>

				<div>
					<p className="text-muted-foreground text-xs">Karlo grgic | 1yr ago</p>
					<p>{comment}</p>
				</div>

				<div className="ml-auto flex items-center gap-6 text-sm">
					<div className="flex items-center gap-2">
						<p>{numberOfLikes}</p>
						<Button variant="blank" className="p-0">
							<Heart
								//  fill="#f59f0a" className="text-primary"
								className="text-background-foreground cursor-pointer"
							/>
						</Button>
					</div>

					<Button
						variant={
							searchParams.get('commentId') === commentId ? 'primary' : 'ghost'
						}
						size="xs"
						className="p-0 px-2 py-0.5"
						isFullyRounded
						onPress={() => {
							const params = new URLSearchParams(searchParams.toString());
							if (searchParams.get('commentId') === commentId) {
								params.delete('commentId');
							} else {
								params.set('commentId', commentId);
							}

							router.push(pathname + '?' + params.toString(), {
								scroll: false,
							});
						}}
						iconLeft={<ReplyIcon />}
					>
						Reply
					</Button>

					<Button
						variant="blank"
						className="text-muted-foreground hover:text-destructive p-0"
					>
						<Trash2 />
					</Button>
				</div>
			</div>

			{!!numberOfReplies && (
				<div className="mt-4">
					<Collapsible
						trigger={
							<div className="group">
								<Tag className="flex cursor-pointer items-center gap-4">
									See {numberOfReplies} replies{' '}
									<ChevronRight className="size-4 transition-transform group-data-[state=open]:-rotate-90" />
								</Tag>
							</div>
						}
						contentProps={{
							children: <Reply numberOfLikes={8} comment="Woah" />,
						}}
					/>
				</div>
			)}
		</div>
	);
};

export const Reply: React.FC<CommentOrReplyProps> = ({
	numberOfLikes,
	comment,
}) => {
	return (
		<div className="ml-8 flex items-center gap-4 py-6">
			<div className="bg-muted-foreground h-full min-h-16 w-px" />
			<div className="flex flex-1 items-center gap-4">
				<Avatar
					imageProps={{
						src: '',
					}}
					colorScheme="gray"
				>
					Ana Horvat
				</Avatar>

				<div>
					<p className="text-muted-foreground text-xs">Karlo grgic | 1yr ago</p>
					<p>{comment}</p>
				</div>

				<Button
					variant="blank"
					className="text-muted-foreground hover:text-destructive ml-auto self-end p-0 text-sm"
				>
					<Trash2 />
				</Button>
			</div>
		</div>
	);
};
