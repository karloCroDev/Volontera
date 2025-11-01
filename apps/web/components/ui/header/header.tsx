'use client';

// External packages
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelsTopLeftIcon } from 'lucide-react';
import {
	Breadcrumbs,
	Breadcrumb as AriaBreadcrumb,
	BreadcrumbProps,
} from 'react-aria-components';

import { ChevronsRight } from 'lucide-react';

// Components
import { Layout } from '@/components/ui/layout-grid';
import { twMerge } from 'tailwind-merge';
import { DarkLightThemeSwitch } from '@/components/ui/header/dark-light-theme';
import { NotificationButton } from '@/components/ui/header/notification-button';
import { Search } from '@/components/ui/header/search';

export const Header = () => {
	const pathname = usePathname();

	const pathnameWithoutSearchParams = pathname.split('?')[0];

	const splittedPathname = pathnameWithoutSearchParams
		?.split('/')
		.filter(Boolean);

	return (
		<div className="border-b-input-border border-b">
			<Layout className="flex h-24 items-center px-4 lg:h-28 lg:gap-10">
				<div className="col-span-12">
					<PanelsTopLeftIcon className="text-muted-foreground hidden size-6 lg:block" />
				</div>
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
			</Layout>
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
