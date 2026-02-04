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
import { useIsMobile } from '@/hooks/utils/useIsMobile';

export const Post: React.FC<{
	post: RetrieveOrganizationPostsResponse['posts'][0];
	isInsideOrganization?: boolean;
	hasAnAdminAccess?: boolean;
}> = ({ post, isInsideOrganization = false, hasAnAdminAccess = false }) => {
	const { data: user } = useSession();
	const hasUserLiked = post.postLikes.some((like) => like.userId === user?.id);

	const splittedContent = post.content.split('.');

	const singlePostImage = post.postImages[0];

	const isMobile = useIsMobile();
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
							src: `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${post.organization.avatarImage}`,
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
							return (
								<div
									className="rouded-md border-input-border relative aspect-[4/3] max-h-[600px] w-full rounded border"
									key={id}
								>
									<Image
										src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${imageUrl}`}
										alt="Post image"
										fill
										className="object-contain"
									/>
								</div>
							);
						})}
					/>
				) : (
					post.postImages.length === 1 && (
						<div className="rouded-md border-input-border relative mt-4 aspect-[4/3] max-h-[600px] w-full rounded border">
							{singlePostImage ? (
								<Image
									src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${singlePostImage.imageUrl}`}
									alt="Post image"
									fill
									className="object-contain"
								/>
							) : (
								<div className="bg-muted-foreground/20 size-full animate-pulse" />
							)}
						</div>
					)
				)}
			</div>

			<div className="mt-auto flex items-center gap-8">
				<div className="flex items-center gap-0 lg:gap-2">
					By:
					<Avatar
						imageProps={{
							src: post.author.image
								? `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${post.author.image}`
								: undefined,
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
						{isMobile
							? post.author.firstName
							: convertToFullname({
									firstname: post.author.firstName,
									lastname: post.author.lastName,
								})}
					</Link>
					<div className="bg-muted-foreground h-5.5 hidden w-px lg:block" />
					<p className="text-muted-foreground hidden text-sm lg:block">
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
