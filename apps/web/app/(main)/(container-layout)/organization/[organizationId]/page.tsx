// External packages
import { notFound } from 'next/navigation';
import Image from 'next/image';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Tag } from '@/components/ui/tag';
import { SharePost } from '@/components/ui/post/share-post';
import { Button } from '@/components/ui/button';
import { AnchorAsButton } from '@/components/ui/anchor-as-button';
import { LinkAsButton } from '@/components/ui/link-as-button';

// Modules
import { OrganizationRoutingHeader } from '@/modules/main/organization/common/organization-routing-header';
import { CreatePostDialog } from '@/modules/main/organization/home/create-post-dialog';
import { PostsMapping } from '@/modules/main/organization/home/posts-mapping';

// Lib
import { getOrganizationDetailsById } from '@/lib/server/organization';
import { retrieveOrganizationPosts } from '@/lib/server/post';
import { retrieveOrganizationMember } from '@/lib/server/organization-managment';
import { Suspense } from 'react';
import { PostSkeleton } from '@/components/ui/post/post-skeleton';

export default async function OrganizationPage({
	params,
}: {
	params: Promise<{
		organizationId: string;
	}>;
}) {
	const { organizationId } = await params;
	const [organizationDetailsById, member] = await Promise.all([
		getOrganizationDetailsById(organizationId),
		retrieveOrganizationMember(organizationId),
	]);

	if (!organizationDetailsById.success) notFound();

	return (
		<>
			<div className="border-input-border relative -mx-4 -my-6 rounded-xl px-5 py-4 md:m-0 md:border">
				<div className="flex justify-between">
					<Tag colorScheme="gray">
						{organizationDetailsById.organization.organizationInfo.type}
					</Tag>
					<SharePost link="" />
				</div>

				<div className="pt-36 md:ml-10">
					<div className="no-scrollbar flex items-end justify-between gap-8 overflow-scroll lg:gap-0">
						<div className="flex w-fit flex-col items-center">
							<Avatar
								imageProps={{
									src: organizationDetailsById.organization.avatarImage,
								}}
								colorScheme="gray"
								size="2xl"
							>
								{organizationDetailsById.organization.name}
							</Avatar>
						</div>

						<div className="flex gap-4">
							<Button colorScheme="yellow" size="md">
								Follow
							</Button>
							<LinkAsButton
								colorScheme="orange"
								size="md"
								href={`/organization/${organizationId}/join-organization`}
							>
								Join
							</LinkAsButton>
						</div>
					</div>
					<h1 className="mt-4 text-xl font-medium md:text-2xl lg:text-3xl">
						{organizationDetailsById.organization.name}
					</h1>
					{/* TODO: Get the number, and just check if user is inside the organization or not */}
					<div className="text-muted-foreground mt-1.5 flex items-center gap-4">
						<p>
							<strong>30</strong> attendees
						</p>
						<hr className="bg-input-border h-6 w-px border-0" />
						<p>
							<strong>300</strong> followers
						</p>
					</div>
					<hr className="bg-input-border my-6 h-px w-full border-0" />

					<div className="flex justify-between lg:gap-8">
						<div>
							{organizationDetailsById.organization.organizationInfo
								.additionalLinks.length > 0 && (
								<>
									<h4 className="text-lg underline underline-offset-4 lg:text-xl">
										Additional links
									</h4>
									<div className="mb-6 mt-3 flex gap-4">
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

							<p className="mt-2">
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

						<div>
							<h4 className="text-lg underline underline-offset-4 lg:text-xl">
								Members
							</h4>
							<div className="mt-3 grid grid-cols-2 items-center gap-4 md:grid-cols-3 xl:grid-cols-4">
								{/* TODO: Samo vrati imena */}
								{[...Array(7)].map((_, indx) => (
									<Tag key={indx} className="flex gap-2" colorScheme="gray">
										<Avatar
											imageProps={{
												src: '',
											}}
											size="xs"
										>
											Ante
										</Avatar>
										Ana
									</Tag>
								))}

								<Tag colorScheme="gray" className="h-fit w-full justify-center">
									+99 more
								</Tag>
							</div>
						</div>
					</div>
				</div>

				<div className="absolute left-0 top-0 -z-[1] h-64 w-full overflow-hidden md:rounded-t-xl">
					<Image
						src={
							organizationDetailsById.organization.organizationInfo.coverImage
						}
						alt="Cover image url"
						fill
						className="object-cover"
					/>
				</div>
			</div>

			{member.success && <OrganizationRoutingHeader member={member} />}
			{member.success &&
				(member.organizationMember.role === 'ADMIN' ||
					member.organizationMember.role === 'OWNER') && <CreatePostDialog />}

			<div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
				<Suspense
					fallback={[...Array(6)].map((_, indx) => (
						<PostSkeleton key={indx} />
					))}
				>
					<Posts organizationId={organizationId} />
				</Suspense>
			</div>
		</>
	);
}

async function Posts({ organizationId }: { organizationId: string }) {
	const posts = await retrieveOrganizationPosts(organizationId);

	if (!posts.success) return <p>There was an error with loading posts</p>;
	return <PostsMapping posts={posts} />;
}
