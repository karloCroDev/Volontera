'use client';

// External packages
import * as React from 'react';
import { twJoin, twMerge } from 'tailwind-merge';
import { ButtonProps } from 'react-aria-components';
import { Building2, ChevronDown, Plus } from 'lucide-react';
import { useParams } from 'next/navigation';

// Components
import { Collapsible } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import {
	AdditionalButtonProps,
	LinkAsButton,
} from '@/components/ui/link-as-button';
import { Avatar } from '@/components/ui/avatar';
import { useSidebarContext } from '@/components/ui/sidebar/sidebar-provider';
import { Indicators } from '@/components/ui/indicators';
import { Dot } from '@/components/ui/dot';

// Hooks
import { useSession } from '@/hooks/data/user';
import { useListOrganizations } from '@/hooks/data/organization';
import { useGetImageFromKeys } from '@/hooks/data/image';
import { useIsMobile } from '@/hooks/utils/useIsMobile';

// Types
import { ListOrganizationsOrganizatorResponse } from '@repo/types/organization';

export const SidebarItem: React.FC<
	React.ComponentPropsWithoutRef<'button'> &
		ButtonProps &
		AdditionalButtonProps & { isSelected?: boolean }
> = ({ isSelected = false, className, isFullyRounded, ...rest }) => {
	return (
		<Button
			{...rest}
			variant={isSelected ? 'primary' : 'ghost'}
			colorScheme={isSelected ? 'orange' : 'bland'}
			isFullyRounded={isSelected || isFullyRounded}
			className={twMerge(
				'w-full justify-start',
				isSelected &&
					'text-background-foreground border-input-border bg-muted hover:bg-muted border',
				className
			)}
		/>
	);
};

export const Organizations = () => {
	const { desktopOpen, setDesktopOpen } = useSidebarContext();

	const isMobile = useIsMobile();
	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		if (!desktopOpen) setOpen(false);
	}, [desktopOpen]);

	const { data: user } = useSession();

	const { data: organizations, isLoading } = useListOrganizations(
		user?.role || undefined,
		{
			enabled: open,
		}
	);

	const { data: images } = useGetImageFromKeys({
		imageUrls: organizations
			? [
					...organizations.attendingOrganizations
						.map((org) => org.avatarImage)
						.filter(Boolean),
					...(organizations?.ownedOrganizations
						?.map((org) => org.avatarImage)
						.filter(Boolean) || []),
					...organizations.followingOrganizations
						.map((org) => org.avatarImage)
						.filter(Boolean),
				]
			: [],
	});

	const params = useParams<{ organizationId: string }>();

	return (
		<Collapsible
			open={open}
			onOpenChange={(val) => {
				if (!desktopOpen) setDesktopOpen(true);

				setOpen(val);
			}}
			trigger={
				desktopOpen ? (
					<SidebarItem
						isSelected={!!params.organizationId}
						className="group"
						iconLeft={(desktopOpen || isMobile) && <Building2 />}
						iconRight={
							(desktopOpen || isMobile) && (
								<ChevronDown className="ml-auto transition-transform group-data-[state=closed]:rotate-0 group-data-[state=open]:rotate-180" />
							)
						}
					>
						Organizations
					</SidebarItem>
				) : (
					<SidebarItem
						size="lg"
						isFullyRounded
						className="p-4"
						isSelected={!!params.organizationId}
					>
						<Building2 className="size-8" />
					</SidebarItem>
				)
			}
			contentProps={{
				children: (
					<>
						<ul className="ml-4 mt-4">
							{isLoading && (
								<li className="ml-8 mt-4 text-xs sm:text-sm lg:text-base">
									<div className="bg-muted-foreground h-6 animate-pulse"></div>
								</li>
							)}
						</ul>

						{user && user.role === 'ORGANIZATION' && (
							<>
								<Indicators>Managing</Indicators>
								<ul className="ml-4">
									{organizations?.ownedOrganizations &&
										(organizations.ownedOrganizations.length > 0 ? (
											organizations.ownedOrganizations.map((organization) => (
												<OrganizationSidebarItem
													key={organization.id}
													organization={organization}
													isSelected={organization.id === params.organizationId}
													imageUrl={images?.urls[organization.avatarImage]}
												/>
											))
										) : (
											<p className="text-muted-foreground mt-4 text-center text-xs sm:text-sm lg:text-base">
												No organizations found.
											</p>
										))}
								</ul>
							</>
						)}
						{user && user.role === 'USER' && (
							<>
								<Indicators>Attending</Indicators>
								<ul className="ml-4">
									{organizations &&
									organizations.attendingOrganizations.length > 0 ? (
										organizations.attendingOrganizations.map((organization) => (
											<OrganizationSidebarItem
												key={organization.id}
												organization={organization}
												isSelected={organization.id === params.organizationId}
												imageUrl={
													images?.urls[organization.avatarImage] || undefined
												}
											/>
										))
									) : (
										<p className="text-muted-foreground mt-4 text-center text-xs sm:text-sm lg:text-base">
											No organizations found.
										</p>
									)}
								</ul>
							</>
						)}
						<Indicators>Following</Indicators>
						<ul className="ml-4">
							{organizations &&
							organizations.followingOrganizations.length > 0 ? (
								organizations?.followingOrganizations.map((organization) => (
									<OrganizationSidebarItem
										key={organization.id}
										organization={organization}
										isSelected={organization.id === params.organizationId}
										imageUrl={images?.urls[organization.avatarImage]}
									/>
								))
							) : (
								<p className="text-muted-foreground mt-4 text-center text-xs sm:text-sm lg:text-base">
									No organizations found.
								</p>
							)}
						</ul>

						{user && user.role === 'ORGANIZATION' && (
							<LinkAsButton
								className="my-4 w-full justify-start"
								href="/organization/create-organization"
								variant="outline"
								colorScheme="orange"
								iconLeft={<Plus />}
							>
								Create Organization
							</LinkAsButton>
						)}
					</>
				),
			}}
		/>
	);
};

export const OrganizationSidebarItem: React.FC<{
	organization: ListOrganizationsOrganizatorResponse['attendingOrganizations'][0]; // Nebitno koja je organizacija, sve vrate isti tip podataka
	isSelected?: boolean;
	imageUrl?: string;
}> = ({ organization, isSelected = false, imageUrl }) => {
	const isMobile = useIsMobile();
	return (
		<li className="mt-4 flex items-center text-sm lg:text-base">
			<LinkAsButton
				variant="ghost"
				size="xs"
				href={`/organization/${organization.id}`}
				className="relative flex w-full items-center justify-start gap-4 hover:opacity-70"
				iconLeft={
					<Dot
						className={twJoin(
							isSelected ? 'bg-pending' : 'bg-muted-foreground'
						)}
					/>
				}
			>
				<Avatar
					imageProps={{
						src: imageUrl,
					}}
					isVerified={organization.owner.subscriptionTier === 'PRO'}
					size={isMobile ? 'sm' : 'md'}
					colorScheme={'gray'}
				>
					{organization.name}
				</Avatar>

				<p className={isSelected ? 'font-semibold' : undefined}>
					{organization.name}
				</p>
			</LinkAsButton>
		</li>
	);
};
