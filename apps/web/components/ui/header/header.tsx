'use client';

// External packages
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import {
	Breadcrumbs,
	Breadcrumb as AriaBreadcrumb,
	BreadcrumbProps,
} from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { ChevronsRight } from 'lucide-react';

// Components
import { DarkLightThemeSwitch } from '@/components/ui/header/dark-light-theme';
import { NotificationButton } from '@/components/ui/header/notification-button';
import { Search } from '@/components/ui/header/search';
import { Button } from '@/components/ui/button';
import { useSidebarContext } from '@/components/ui/sidebar/sidebar-provider';

// Hooks
import { useIsMobile } from '@/hooks/utils/useIsMobile';

export const Header = () => {
	const isMobile = useIsMobile();

	const { setMobileOpen } = useSidebarContext();
	const pathname = usePathname();

	const pathnameWithoutSearchParams = pathname.split('?')[0];

	const splittedPathname =
		!isMobile && pathnameWithoutSearchParams?.split('/').filter(Boolean);

	return (
		<div className="border-input-border border-b">
			<nav className="flex h-24 w-full items-center gap-6 px-6 lg:h-28 lg:gap-10 lg:pl-8 lg:pr-12">
				<Button
					variant="outline"
					colorScheme="bland"
					isFullyRounded
					className="block p-2 lg:hidden"
					onClick={() => setMobileOpen(true)}
				>
					<Menu />
				</Button>

				{/* {!isMobile && splittedPathname && (
					<Breadcrumbs className="flex gap-4 lg:gap-5">
						{splittedPathname.map((path, index) => {
							const href = '/' + splittedPathname.slice(0, index + 1).join('/');
							return (
								<Breadcrumb
									href={href}
									key={index}
									removeChevrons={splittedPathname.length - 1 !== index}
								>
									{path[0]?.toUpperCase() + path.slice(1).toLowerCase()}
								</Breadcrumb>
							);
						})}
					</Breadcrumbs>
				)} */}
				<div className="ml-auto flex items-center gap-5 lg:gap-8">
					<Search />
					<NotificationButton />
					<DarkLightThemeSwitch />
				</div>
			</nav>
		</div>
	);
};
const Breadcrumb: React.FC<
	React.ComponentPropsWithoutRef<'li'> &
		BreadcrumbProps & {
			href: string;
			removeChevrons?: boolean;
		}
> = ({ href, removeChevrons = true, className, children, ...rest }) => {
	return (
		<AriaBreadcrumb
			{...rest}
			className={twMerge('flex items-center gap-4', className)}
		>
			<Link
				href={href}
				className="lg:text-md hover:text-muted-foreground text-base underline-offset-4 hover:underline"
			>
				{children}
			</Link>
			{removeChevrons && <ChevronsRight aria-hidden />}
		</AriaBreadcrumb>
	);
};
