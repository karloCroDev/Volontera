// External packages
import { notFound } from 'next/navigation';
import Image from 'next/image';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Post } from '@/components/ui/post/post';
import { Tag } from '@/components/ui/tag';
import { SharePost } from '@/components/ui/post/share-post';
import { Button } from '@/components/ui/button';
import { AnchorAsButton } from '@/components/ui/anchor-as-button';

// Modules
import { OrganizationRoutingHeader } from '@/modules/main/organization/common/organization-routing-header';
import { NewPostDialog } from '@/modules/main/organization/home/new-post-dialog';
import { JoinDialog } from '@/modules/main/organization/common/join-dialog';

// Lib
import { getOrganizationDetailsById } from '@/lib/server/organization';
import { getImageFromKey } from '@/lib/server/image';

export default async function OrganizationPage({
	params,
}: {
	params: { organizationId: string };
}) {
	const organizationDetailsById = await getOrganizationDetailsById(
		params.organizationId
	);

	if (!organizationDetailsById.success) notFound();

	const avatarKey = organizationDetailsById.organization.avatarImage;
	const coverKey =
		organizationDetailsById.organization.organizationInfo.coverImage;
	const imageKeys = [avatarKey, coverKey].filter((key): key is string =>
		Boolean(key)
	);

	const imageResponse = imageKeys.length
		? await getImageFromKey({ imageUrls: imageKeys })
		: null;

	const organizationAvatarImage =
		avatarKey && imageResponse?.urls ? imageResponse.urls[avatarKey] : '';
	const organizationCoverImage =
		coverKey && imageResponse?.urls ? imageResponse.urls[coverKey] : '';
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
									src: organizationAvatarImage,
								}}
								colorScheme="gray"
								size="2xl"
							>
								Organization
							</Avatar>
						</div>

						<div className="flex gap-4">
							<Button colorScheme="yellow" size="md">
								Follow
							</Button>
							<JoinDialog />
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

				<div className="bg-input-border absolute left-0 top-0 -z-[1] h-64 w-full overflow-hidden md:rounded-t-xl">
					{organizationCoverImage && (
						<Image
							src={organizationCoverImage}
							alt="Cover image url"
							fill
							className="object-cover"
						/>
					)}
				</div>
			</div>

			<OrganizationRoutingHeader />
			<NewPostDialog />
			<Post
				title="Example title"
				content="Lorem ipsum dolorem et imet sssswqdd po qkwd kqwdkpoqwpodk qk. What is going on in this world. Hello w"
			/>
		</>
	);
}
