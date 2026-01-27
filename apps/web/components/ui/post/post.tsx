/* eslint react/prop-types: 0 */
'use client';

// External packages
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, MessageCircleMore } from 'lucide-react';
import Markdown from 'react-markdown';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Collapsible } from '@/components/ui/collapsible';
import { LinkAsButton } from '@/components/ui/link-as-button';
import { PostLike } from '@/components/ui/post/post-like';
import { SharePost } from '@/components/ui/post/share-post';
import { EditPostDialog } from '@/components/ui/post/edit-post-dialog';
import { DeletePostDialog } from '@/components/ui/post/delete-post-dialog';
import { Carousel } from '@/components/ui/carousel';

// Types
import { RetrieveOrganizationPostsResponse } from '@repo/types/post';

// Lib
import { convertToFullname } from '@/lib/utils/converter';
import { formatTime } from '@/lib/utils/time-adjustments';

// Hooks
import { useSession } from '@/hooks/data/user';

export const Post: React.FC<{
	post: RetrieveOrganizationPostsResponse['posts'][0];
	isInsideOrganization?: boolean;
	images?: Record<string, string>;
	hasAnAdminAccess?: boolean;
}> = ({
	images,
	post,
	isInsideOrganization = false,
	hasAnAdminAccess = false,
}) => {
	const { data: user } = useSession();
	const hasUserLiked = post.postLikes.some((like) => like.userId === user?.id);

	const splittedContent = post.content.split('.');
	const singlePostImage = post.postImages[0];
	const singlePostImageSrc = singlePostImage
		? images?.[singlePostImage.imageUrl]
		: undefined;
	return (
		<div className="border-input-border bg-muted flex flex-col rounded-xl border px-8 py-6 shadow-xl">
			<div className="mb-8 flex gap-4">
				<Link
					href={`/organization/${post.organizationId}`}
					className="flex cursor-pointer items-center gap-2"
				>
					<Avatar
						colorScheme="gray"
						imageProps={{
							src: images?.[post.organization.avatarImage],
						}}
						isVerified={post.organization.owner.subscriptionTier === 'PRO'}
					>
						{post.organization.name}
					</Avatar>

					<div>
						<p>{post.organization.name}</p>
						<p className="text-muted-foreground text-sm">
							{post.organization._count.organizationMembers} members |{' '}
							{post.organization._count.organizationFollowers} followers
						</p>
					</div>
				</Link>

				<div className="ml-auto flex gap-2">
					{hasAnAdminAccess && (
						<DeletePostDialog
							postId={post.id}
							organizationId={post.organizationId}
						/>
					)}
					{!isInsideOrganization && (
						<LinkAsButton
							href={`/organization/${post.organizationId}`}
							colorScheme="yellow"
							size="sm"
							className="ml-auto"
						>
							Explore
						</LinkAsButton>
					)}

					{hasAnAdminAccess && (
						<EditPostDialog
							postId={post.id}
							organizationId={post.organizationId}
						/>
					)}
				</div>
			</div>
			<Link
				href={`/organization/post/${post.id}`}
				className="mb-4 text-lg font-semibold underline-offset-4 hover:underline"
			>
				{post.title}
			</Link>

			{splittedContent.length > 1 ? (
				<Collapsible
					trigger={
						<div className="group cursor-pointer">
							<div className="prose prose-custom">
								<Markdown>{splittedContent[0]}</Markdown>
							</div>

							<div className="flex items-baseline justify-center gap-4">
								<p className="text-muted-foreground mt-2 text-center group-data-[state=open]:hidden">
									Show more
								</p>
								<ChevronDown className="size-3 group-data-[state=open]:hidden" />
							</div>
						</div>
					}
					contentProps={{
						children: <Markdown>{splittedContent.slice(1).join('.')}</Markdown>,
					}}
				/>
			) : (
				<div className="prose prose-custom">
					<Markdown>{splittedContent[0]}</Markdown>
				</div>
			)}

			<div className="mb-6 mt-4">
				{post.postImages.length > 1 ? (
					<Carousel
						slides={post.postImages.map(({ imageUrl, id }) => {
							const src = images?.[imageUrl];
							if (!src) return null;

							return (
								<div
									className="rouded-md border-input-border relative aspect-[4/3] max-h-[600px] w-full rounded border"
									key={id}
								>
									<Image
										src={src}
										alt="Post image"
										fill
										className="object-contain"
									/>
								</div>
							);
						})}
					/>
				) : (
					post.postImages.length === 1 &&
					singlePostImageSrc && (
						<div className="rouded-md border-input-border relative mt-4 aspect-[4/3] max-h-[600px] w-full rounded border">
							<Image
								src={singlePostImageSrc}
								alt="Post image"
								fill
								className="object-contain"
							/>
						</div>
					)
				)}
			</div>

			<div className="mt-auto flex items-center gap-8">
				<div className="flex items-center gap-2">
					By:
					<Avatar
						imageProps={{
							src: post.author.image ? images?.[post.author.image] : undefined,
						}}
						isVerified={post.author.subscriptionTier === 'PRO'}
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
					<div className="bg-muted-foreground h-5.5 hidden w-px md:block" />
					<p className="text-muted-foreground hidden text-sm md:block">
						{formatTime(new Date(post.createdAt))}
					</p>
				</div>

				<PostLike
					count={post._count.postLikes}
					hasUserLiked={hasUserLiked}
					postId={post.id}
				/>
				<LinkAsButton
					variant="ghost"
					size="xs"
					href={`/organization/post/${post.id}`}
					iconLeft={
						<MessageCircleMore className="text-background-foreground cursor-pointer" />
					}
				>
					<p className="font-semibold italic underline underline-offset-4">
						{post._count.postComments}
					</p>
				</LinkAsButton>
				<SharePost link={`/organization/post/${post.id}`} />
			</div>
		</div>
	);
};
