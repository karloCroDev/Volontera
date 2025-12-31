// External packages
import { notFound } from 'next/navigation';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Post } from '@/components/ui/post/post';
import { Tag } from '@/components/ui/tag';
import { SharePost } from '@/components/ui/post/share-post';
import { Button } from '@/components/ui/button';
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';

// Modules
import { OrganizationRoutingHeader } from '@/modules/main/organization/common/organization-routing-header';
import { NewPostDialog } from '@/modules/main/organization/home/new-post-dialog';
import { JoinDialog } from '@/modules/main/organization/common/join-dialog';
import { getOrganizationDetailsById } from '@/lib/server/organization';

export default async function OrganizationPage({
	params,
}: {
	params: { organizationId: string };
}) {
	const organizationDetailsById = await getOrganizationDetailsById(
		params.organizationId
	);

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
									src: '',
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

					<Layout className="gap-y-6 lg:gap-y-0">
						<LayoutColumn
							start={1}
							end={{
								base: 13,
								lg: 8,
							}}
						>
							{organizationDetailsById.organization.organizationInfo
								.additionalLinks.length > 0 && (
								<>
									<h4 className="text-lg underline underline-offset-4 lg:text-xl">
										Additional links
									</h4>
									<div className="mt-3 flex gap-4">
										{organizationDetailsById.organization.organizationInfo.additionalLinks.map(
											({ link, id }) => (
												<a
													key={id}
													href={link}
													target="_blank"
													rel="noopener noreferrer"
												>
													<Tag colorScheme="gray">{link}</Tag>
												</a>
											)
										)}
									</div>
								</>
							)}
							<h4 className="mt-6 text-lg underline underline-offset-4 lg:text-xl">
								About
							</h4>

							<p className="mt-2">
								{organizationDetailsById.organization.organizationInfo.bio}
							</p>
						</LayoutColumn>

						<LayoutColumn
							start={{
								base: 1,
								lg: 10,
							}}
							end={13}
							className="flex flex-col gap-3"
						>
							<p className="text-muted-foreground">21 street, New York, USA</p>
							<div className="border-input-border h-full min-h-80 flex-1 rounded-lg border"></div>
						</LayoutColumn>
					</Layout>
				</div>

				<div className="bg-input-border absolute left-0 top-0 -z-[1] h-64 w-full md:rounded-t-xl" />
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
