'use client';

// External packages
import * as React from 'react';
import { twJoin, twMerge } from 'tailwind-merge';
import { ButtonProps } from 'react-aria-components';
import { Building2, ChevronDown } from 'lucide-react';

// Components
import { Collapsible } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { AdditionalButtonProps } from '@/components/ui/link-as-button';
import { useSidebarContext } from '@/components/ui/sidebar/sidebar-provider';
import { useIsMobile } from '@/hooks/utils/useIsMobile';
import Link from 'next/link';
import { Avatar } from '@/components/ui/avatar';

export const SidebarItem: React.FC<
	React.ComponentPropsWithoutRef<'button'> &
		ButtonProps &
		AdditionalButtonProps & { isSelected?: boolean }
> = ({ isSelected = false, className, ...rest }) => {
	return (
		<Button
			{...rest}
			isFullyRounded={isSelected}
			variant={isSelected ? 'primary' : 'blank'}
			colorScheme={isSelected ? 'orange' : 'bland'}
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
	return (
		<Collapsible
			open={open}
			onOpenChange={(val) => {
				if (!desktopOpen) setDesktopOpen(true);

				setOpen(val);
			}}
			trigger={
				<SidebarItem
					className="group"
					iconLeft={(desktopOpen || isMobile) && <Building2 />}
					iconRight={
						(desktopOpen || isMobile) && (
							<ChevronDown className="ml-auto transition-transform group-data-[state=closed]:rotate-0 group-data-[state=open]:rotate-180" />
						)
					}
				>
					{desktopOpen || isMobile ? (
						'Orgnanizations'
					) : (
						<Building2 className="mx-auto" />
					)}
				</SidebarItem>
			}
			contentProps={{
				children: (
					<ul className="border-input-border ml-4 mt-4 border-t">
						{[...Array(3)].map((_, i) => (
							<li key={i} className="ml-8 mt-4 text-xs sm:text-sm lg:text-base">
								<Link
									href={`/organizations/${i.toString()}`}
									className="relative flex items-center gap-4 pl-6 hover:opacity-70"
								>
									<span
										className={twJoin(
											'absolute left-0 top-3 h-2 w-2 rounded-full',
											i == 1 ? 'bg-pending' : 'bg-muted-foreground'
										)}
									/>

									<Avatar
										imageProps={{
											src: '',
										}}
										size={isMobile ? 'sm' : 'md'}
										variant={!isMobile ? 'primary' : 'secondary'}
									>
										Organization
									</Avatar>
									<p className={i == 1 ? 'font-semibold' : undefined}>
										Organization {i + 1}
									</p>
								</Link>
							</li>
						))}
					</ul>
				),
			}}
		/>
	);
};
