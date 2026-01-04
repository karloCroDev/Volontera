// External packages
import { ChevronDown, MessageCircleMore } from 'lucide-react';
import Link from 'next/link';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Collapsible } from '@/components/ui/collapsible';
import { LinkAsButton } from '@/components/ui/link-as-button';

// Modules
import { PostLike } from '@/components/ui/post/post-like';
import { SharePost } from '@/components/ui/post/share-post';
import { EditPost } from '@/components/ui/post/edit-post';

// Repo Types
import { RetrieveOrganizationPostsResponse } from '@repo/types/post';
import { convertToFullname } from '@/lib/utils/convert-to-fullname';

export const Post: React.FC<{
	post: RetrieveOrganizationPostsResponse['posts'][0];
	isInsideOrganization?: boolean;
	images?: Record<string, string>;
}> = ({
	/* eslint react/prop-types: 0 */
	images,
	post,
	isInsideOrganization = false,
}) => {
	const splittedContent = post.content.split('.');

	return (
		<div className="border-input-border bg-muted rounded-xl border px-8 py-6">
			<div className="mb-8 flex gap-4">
				<div className="flex items-center gap-2">
					<Avatar
						colorScheme="gray"
						imageProps={{
							src: images?.[post.organization.avatarImage],
						}}
					>
						{post.organization.name}
					</Avatar>

					<div>
						<p>{post.organization.name}</p>
						<p className="text-muted-foreground text-sm">20 attendees</p>
					</div>
				</div>

				{!isInsideOrganization && (
					<LinkAsButton
						href="/home/explore"
						colorScheme="yellow"
						size="sm"
						className="ml-auto"
					>
						Explore
					</LinkAsButton>
				)}
				<EditPost />
			</div>
			<h4 className="mb-4 text-lg font-semibold">{post.title}</h4>
			<Collapsible
				trigger={
					<div className="group cursor-pointer">
						<p className="cursor-pointer italic">{splittedContent[0]}</p>

						<div className="flex items-baseline justify-center gap-4">
							<p className="text-muted-foreground mt-2 text-center group-data-[state=open]:hidden">
								Show more
							</p>
							<ChevronDown className="size-3 group-data-[state=open]:hidden" />
						</div>
					</div>
				}
				contentProps={{
					children: <p>{splittedContent.slice(1).join('.')}</p>,
				}}
			/>

			<div className="rouded-md border-input-border mt-4 aspect-[4/3] max-h-[600px] w-full rounded border" />

			<div className="mt-6 flex items-center gap-8">
				<div className="flex items-center gap-2">
					Written by:
					<Avatar
						imageProps={{
							src: post.author.image ? images?.[post.author.image] : undefined,
						}}
						size="xs"
						className="ml-2"
					>
						{convertToFullname({
							firstname: post.author.firstName,
							lastname: post.author.lastName,
						})}
					</Avatar>
					<Link
						href={`/profile/${post.authorId}`}
						className="text-muted-foreground text-sm underline-offset-4 hover:underline"
					>
						{convertToFullname({
							firstname: post.author.firstName,
							lastname: post.author.lastName,
						})}
					</Link>
				</div>

				<PostLike count={post._count.postLikes} />
				<Link
					href={`/organization/post/${post.id}`}
					className="flex items-center gap-4"
				>
					<MessageCircleMore
						//  fill="#f59f0a" className="text-primary"
						className="text-background-foreground cursor-pointer"
					/>
					<p className="font-semibold italic underline underline-offset-4">
						{post._count.postComments}
					</p>
				</Link>
				<SharePost link={`/organization/post/${post.id}`} />
			</div>
		</div>
	);
};
