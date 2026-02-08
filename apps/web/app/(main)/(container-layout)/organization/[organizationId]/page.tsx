// External packages
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Image from 'next/image';

import {
	hasWantedOrganizationRole,
	isOrganizationAccount,
} from '@repo/permissons/index';
import { dehydrate, QueryClient } from '@tanstack/react-query';

// Components
import { Avatar } from '@/components/ui/avatar';
import { LinkAsTag, Tag } from '@/components/ui/tag';
import { SharePost } from '@/components/ui/post/share-post';
import { AnchorAsButton } from '@/components/ui/anchor-as-button';
import { LinkAsButton } from '@/components/ui/link-as-button';
import { PostSkeleton } from '@/components/ui/post/post-skeleton';
import { Indicators } from '@/components/ui/indicators';

// Modules
import { OrganizationRoutingHeader } from '@/modules/main/organization/common/organization-routing-header';
import { CreatePostDialog } from '@/modules/main/organization/home/create-post-dialog';
import { PostsMapping } from '@/modules/main/organization/home/posts-mapping';
import { PostsSelect } from '@/modules/main/organization/home/posts-select';
import { FollowOrganizationButton } from '@/modules/main/organization/common/follow-organization-button';
import { LeaveOrganizationDialog } from '@/modules/main/organization/common/leave-organization-dialog';

// Lib
import { getOrganizationDetailsById } from '@/lib/server/organization';
import { retrieveOrganizationPosts } from '@/lib/server/post';
import { retrieveOrganizationMember } from '@/lib/server/organization-managment';
import { convertToFullname } from '@/lib/utils/converter';
import { getSession } from '@/lib/server/user';

export default async function OrganizationPage({
	params,
	searchParams,
}: {
	params: Promise<{
		organizationId: string;
	}>;
	searchParams?: Promise<{ filter?: string }>;
}) {
	const { organizationId } = await params;
	const resolvedSearchParams = await searchParams;
	const filter =
		resolvedSearchParams?.filter === 'recommended' ||
		resolvedSearchParams?.filter === 'newest' ||
		resolvedSearchParams?.filter === 'oldest'
			? resolvedSearchParams.filter
			: undefined;

	const [session, organizationDetailsById, member] = await Promise.all([
		getSession(),
		getOrganizationDetailsById(organizationId),
		retrieveOrganizationMember(organizationId),
	]);

	if (!organizationDetailsById.success) notFound();

	const isOwner =
		session.success &&
		session.id === organizationDetailsById.organization.owner.id;
	const canShowFollowButton = session.success && !isOwner;
	const canShowJoinButton =
		session.success && !member.success && !isOrganizationAccount(session.role);
	const canShowActions =
		!isOwner && (canShowFollowButton || member.success || canShowJoinButton);

	return (
		<>
			<div className="border-input-border relative -mx-4 -my-6 rounded-xl px-5 py-4 shadow-xl md:m-0 md:border">
				<div className="flex justify-between">
					<Tag colorScheme="gray">
						{organizationDetailsById.organization.organizationInfo.type}
					</Tag>
					<SharePost link={`/organization/${organizationId}`} />
				</div>

				<div className="pt-36 md:ml-10">
					<div className="no-scrollbar flex items-end justify-between gap-8 overflow-scroll lg:gap-0">
						<div className="flex w-fit flex-col items-center">
							<Avatar
								imageProps={{
									src: `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${organizationDetailsById.organization.avatarImage}`,
								}}
								colorScheme="gray"
								size="2xl"
								isVerified={
									organizationDetailsById.organization.owner
										.subscriptionTier === 'PRO'
								}
							>
								{organizationDetailsById.organization.name}
							</Avatar>
						</div>

						{canShowActions && (
							<div className="flex gap-4">
								{canShowFollowButton && (
									<FollowOrganizationButton
										hasUserFollowed={organizationDetailsById.isFollowing}
									/>
								)}

								{member.success ? (
									<LeaveOrganizationDialog
										organizationName={organizationDetailsById.organization.name}
									/>
								) : (
									canShowJoinButton && (
										<LinkAsButton
											colorScheme="orange"
											size="md"
											href={`/organization/${organizationId}/join-organization`}
										>
											Join
										</LinkAsButton>
									)
								)}
							</div>
						)}
					</div>
					<h1 className="mt-4 text-xl font-medium md:text-2xl lg:text-3xl">
						{organizationDetailsById.organization.name}
					</h1>
					<div className="text-muted-foreground mt-1.5 flex items-center gap-4">
						<p>
							<strong>
								{
									organizationDetailsById.organization._count
										.organizationMembers
								}
							</strong>{' '}
							members
						</p>
						<hr className="bg-input-border h-6 w-px border-0" />
						<p>
							<strong>
								{
									organizationDetailsById.organization._count
										.organizationFollowers
								}
							</strong>
							followers
						</p>
					</div>
					<hr className="bg-input-border my-6 h-px w-full border-0" />

					<div className="flex justify-between gap-4 lg:gap-8">
						<div className="flex-1">
							{organizationDetailsById.organization.organizationInfo
								.additionalLinks.length > 0 && (
								<>
									<h4 className="text-lg underline underline-offset-4 lg:text-xl">
										Additional links
									</h4>
									<div className="mb-6 mt-3 flex flex-col gap-4 lg:flex-row">
										{organizationDetailsById.organization.organizationInfo.additionalLinks.map(
											({ name, url, id }) => (
												<AnchorAsButton
													key={id}
													size="xs"
													href={url}
													isFullyRounded
													className="border-accent-foreground/10 border"
													colorScheme="yellow"
												>
													{name}
												</AnchorAsButton>
											)
										)}
									</div>
								</>
							)}
							<h4 className="text-lg underline underline-offset-4 lg:text-xl">
								About
							</h4>

							<p className="mt-2 text-balance">
								{organizationDetailsById.organization.organizationInfo.bio}
							</p>

							{organizationDetailsById.organization.organizationInfo
								.location && (
								<>
									<h4 className="mt-6 text-lg underline underline-offset-4 lg:text-xl">
										Location
									</h4>

									<p className="mt-2">
										{
											organizationDetailsById.organization.organizationInfo
												.location
										}
									</p>
								</>
							)}
						</div>

						<div className="flex-1">
							<h4 className="text-lg underline underline-offset-4 lg:text-xl">
								Members
							</h4>

							<Indicators className="mb-3">Owner</Indicators>
							<LinkAsTag
								href={`/profile/${organizationDetailsById.organization.owner.id}`}
								className="flex gap-2"
								colorScheme="gray"
							>
								<Avatar
									imageProps={{
										src: `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${organizationDetailsById.organization.owner.image}`,
									}}
									size="xs"
								>
									{convertToFullname({
										firstname:
											organizationDetailsById.organization.owner.firstName ||
											'',
										lastname:
											organizationDetailsById.organization.owner.lastName || '',
									})}
								</Avatar>
								{convertToFullname({
									firstname:
										organizationDetailsById.organization.owner.firstName || '',
									lastname:
										organizationDetailsById.organization.owner.lastName || '',
								})}
							</LinkAsTag>

							<Indicators className="mb-3">Admins</Indicators>
							<div className="flex flex-col gap-4 lg:flex-row lg:items-center">
								{organizationDetailsById.membersHierarchy.admins.map(
									(admin) => (
										<LinkAsTag
											href={`/profile/${admin.user.id}`}
											key={admin.id}
											className="flex gap-2"
											colorScheme="gray"
										>
											<Avatar
												imageProps={{
													src: admin.user.image
														? `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${admin.user.image}`
														: undefined,
												}}
												size="xs"
											>
												{convertToFullname({
													firstname: admin.user.firstName || '',
													lastname: admin.user.lastName || '',
												})}
											</Avatar>
											{convertToFullname({
												firstname: admin.user.firstName || '',
												lastname: admin.user.lastName || '',
											})}
										</LinkAsTag>
									)
								)}
							</div>

							<Indicators className="mb-3">Members</Indicators>
							<div className="flex flex-col gap-4 lg:flex-row lg:items-center">
								{organizationDetailsById.membersHierarchy.members.map(
									(member) => (
										<LinkAsTag
											href={`/profile/${member.user.id}`}
											key={member.id}
											className="flex gap-2"
											colorScheme="gray"
										>
											<Avatar
												imageProps={{
													src: member.user.image
														? `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${member.user.image}`
														: undefined,
												}}
												size="xs"
											>
												{convertToFullname({
													firstname: member.user.firstName || '',
													lastname: member.user.lastName || '',
												})}
											</Avatar>
											{convertToFullname({
												firstname: member.user.firstName || '',
												lastname: member.user.lastName || '',
											})}
										</LinkAsTag>
									)
								)}

								{organizationDetailsById.organization._count
									.organizationMembers > 5 && (
									<Tag colorScheme="gray">
										+
										{organizationDetailsById.organization._count
											.organizationMembers - 3}
										more
									</Tag>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="absolute left-0 top-0 -z-[1] h-64 w-full overflow-hidden md:rounded-t-xl">
					<Image
						src={`${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${organizationDetailsById.organization.organizationInfo.coverImage}`}
						alt="Cover image url"
						fill
						className="object-cover"
					/>
				</div>
			</div>

			{member.success && <OrganizationRoutingHeader member={member} />}
			{member.success &&
				hasWantedOrganizationRole({
					requiredRoles: ['OWNER', 'ADMIN'],
					userRole: member.organizationMember.role,
				}) && <CreatePostDialog />}

			<div className="mt-12 flex justify-between md:mt-6">
				<h2 className="text-xl lg:text-2xl">Posts</h2>
				<PostsSelect />
			</div>
			<div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
				<Suspense
					fallback={[...Array(6)].map((_, indx) => (
						<PostSkeleton key={indx} />
					))}
				>
					<Posts organizationId={organizationId} filter={filter} />
				</Suspense>
			</div>
		</>
	);
}

async function Posts({
	organizationId,
	filter,
}: {
	organizationId: string;
	filter?: 'recommended' | 'newest' | 'oldest';
}) {
	const posts = await retrieveOrganizationPosts(organizationId, filter);

	if (!posts.success) return <p>There was an error with loading posts</p>;

	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ['posts', organizationId, filter ?? 'recommended'],
		queryFn: async () => posts,
	});
	const dehydratedState = dehydrate(queryClient);
	return <PostsMapping dehydratedState={dehydratedState} />;
}
