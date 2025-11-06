'use client';

// External packages
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	Hamburger,
	Menu,
	PanelsTopLeft,
	PanelsTopLeftIcon,
} from 'lucide-react';
import {
	Breadcrumbs,
	Breadcrumb as AriaBreadcrumb,
	BreadcrumbProps,
} from 'react-aria-components';

import { ChevronsRight } from 'lucide-react';

// Components
import { twMerge } from 'tailwind-merge';
import { DarkLightThemeSwitch } from '@/components/ui/header/dark-light-theme';
import { NotificationButton } from '@/components/ui/header/notification-button';
import { Search } from '@/components/ui/header/search';
import { Button } from '@/components/ui/button';
import { useSidebarContext } from '@/components/ui/sidebar/sidebar-provider';

export const Header = () => {
	const { setDesktopOpen, setMobileOpen } = useSidebarContext();

	const pathname = usePathname();

	const pathnameWithoutSearchParams = pathname.split('?')[0];

	const splittedPathname = pathnameWithoutSearchParams
		?.split('/')
		.filter(Boolean);

	return (
		<nav className="border-input-border flex h-24 w-full items-center gap-6 border-b px-2 lg:h-28 lg:gap-10">
			<Button
				variant="outline"
				colorScheme="bland"
				isFullyRounded
				className="block p-2 lg:hidden"
				onClick={() => setMobileOpen(true)}
			>
				<Menu />
			</Button>

			<Breadcrumbs className="flex gap-4 lg:gap-5">
				{splittedPathname?.map((path, index) => {
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

			<div className="ml-auto flex items-center gap-5 lg:gap-8">
				<Search />
				<NotificationButton />
				<DarkLightThemeSwitch />
			</div>
		</nav>
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
			className={twMerge(
				'hover:text-muted-foreground flex items-center gap-4 underline-offset-4 hover:underline',
				className
			)}
		>
			<Link href={href} className="lg:text-md text-base">
				{children}
			</Link>
			{removeChevrons && <ChevronsRight aria-hidden />}
		</AriaBreadcrumb>
	);
};
