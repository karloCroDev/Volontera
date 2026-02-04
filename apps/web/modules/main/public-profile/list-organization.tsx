'use client';

// External packages
import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from 'react-aria-components';

// Components
import { Collapsible } from '@/components/ui/collapsible';
import { Avatar } from '@/components/ui/avatar';
import { LinkAsButton } from '@/components/ui/link-as-button';

// Modules
import { InformationContainer } from '@/modules/main/public-profile/information-container';
import { useRetrieveAllOrganizationsForUser } from '@/hooks/data/user';
import { useParams } from 'next/navigation';

export const ListOrganizations = () => {
	const [open, setOpen] = React.useState(false);

	const params = useParams<{ userId: string }>();

	const { data, isLoading } = useRetrieveAllOrganizationsForUser(
		params.userId,
		{
			// Samo kada su otvorene, da ne bi odmah fetchao na loadu stranice
			enabled: open,
		}
	);

	return (
		<InformationContainer>
			<Collapsible
				open={open}
				onOpenChange={setOpen}
				trigger={
					<Button className="group flex w-full justify-between outline-none">
						<p className="text-lg lg:text-xl">Organizations</p>
						<div className="flex items-center justify-center gap-2">
							<p className="text-muted-foreground group-data-[state=open]:hidden">
								See all organizations
							</p>
							<p className="text-muted-foreground hidden group-data-[state=open]:block">
								Close all organizations
							</p>
							<ChevronRight className="size-4 transition-transform group-data-[state=open]:-rotate-90" />
						</div>
					</Button>
				}
				contentProps={{
					children: (
						<div className="flex flex-col gap-4">
							{isLoading &&
								[...Array(3)].map((_, index) => (
									<ListOrganizationSkeleton key={index} />
								))}

							{data && data.organizations.length > 0 ? (
								data?.organizations.map((organization, index) => (
									<div
										className="border-input-border bg-muted mt-4 flex items-center gap-4 rounded-md border px-4 py-3"
										key={index}
									>
										<Avatar
											imageProps={{
												src: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${organization.avatarImage}`,
											}}
											isVerified={organization.owner.subscriptionTier === 'PRO'}
											colorScheme="gray"
										>
											{organization.name}
										</Avatar>

										<p className="text-md">{organization.name}</p>

										<LinkAsButton
											href={`/organization/${organization.id}`}
											size="sm"
											className="ml-auto"
										>
											Explore
										</LinkAsButton>
									</div>
								))
							) : (
								<p className="text-muted-foreground">
									This user is not part of any organizations.
								</p>
							)}
						</div>
					),
				}}
			/>
		</InformationContainer>
	);
};

const ListOrganizationSkeleton = () => (
	<div className="border-input-border bg-muted mt-4 flex items-center gap-4 rounded-md border px-4 py-3">
		<div className="bg-muted-foreground/20 h-10 w-10 animate-pulse rounded-full" />
		<div className="bg-muted-foreground/20 h-4 w-48 animate-pulse rounded" />
		<div className="bg-muted-foreground/20 ml-auto h-8 w-20 animate-pulse rounded" />
	</div>
);
