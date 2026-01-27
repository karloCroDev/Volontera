'use client';

// External packages
import * as React from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
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
	const params = useParams();

	const organizationId = params.organizationId;
	const userId = params.userId;
	const postId = params.postId;

	const pathnameWithoutSearchParams = pathname.split('?')[0];

	const splittedPathname =
		!isMobile && pathnameWithoutSearchParams?.split('/').filter(Boolean);

	// TODO: Fetch the organization names if I have any more time

	const shouldSkipCrumb = (segment: string) => {
		if (segment === 'organization') return true;
		if (segment === 'auth') return true;
		if (segment === 'profile') return true;
		if (
			segment === 'post' &&
			Array.isArray(splittedPathname) &&
			splittedPathname[0] === 'organization'
		)
			return true;
		if (segment === organizationId) return false;
		if (segment === userId) return false;
		if (segment === postId) return false;
		return false;
	};

	const getCrumbLabel = (segment: string) => {
		if (segment === organizationId) return 'Organization';
		if (segment === userId) return 'Profile';
		if (segment === postId) return 'Post';
		return segment
			.split('-')
			.filter(Boolean)
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join(' ');
	};

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

				{!isMobile && splittedPathname && (
					<Breadcrumbs className="flex gap-4 lg:gap-5">
						{splittedPathname
							.map((segment, index) => {
								if (shouldSkipCrumb(segment)) return null;
								const href =
									'/' + splittedPathname.slice(0, index + 1).join('/');
								const label = getCrumbLabel(segment);
								if (!label) return null;
								return { href, label, key: index };
							})
							.filter(Boolean)
							.map(
								(crumb, index, arr) =>
									crumb?.href && (
										<Breadcrumb
											href={crumb.href}
											key={crumb.key}
											removeChevrons={arr.length - 1 !== index}
										>
											{crumb.label}
										</Breadcrumb>
									)
							)}
					</Breadcrumbs>
				)}
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
