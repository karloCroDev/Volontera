'use client';

// External packages
import {
	ChartSpline,
	ChevronLast,
	HelpCircle,
	Home,
	MessageCircleMore,
	Settings,
	X,
} from 'lucide-react';
import { twJoin } from 'tailwind-merge';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Components
import { Button } from '@/components/ui/button';
import { useSidebarContext } from '@/components/ui/sidebar/sidebar-provider';
import { UserInformation } from '@/components/ui/sidebar/user-information';
import {
	Organizations,
	SidebarItem,
} from '@/components/ui/sidebar/sidebar-items';
import { Volontera } from '@/components/ui/volonotera';
import { Icon } from '@/components/ui/icon';

// Types
import { UserResponse } from '@repo/types/user';
import { isAdminAccount } from '@repo/permissons/index';

export const Sidebar: React.FC<{
	user: UserResponse;
}> = ({ /* eslint react/prop-types: 0 */ user }) => {
	const { desktopOpen, setDesktopOpen } = useSidebarContext();

	const pathname = usePathname();

	return (
		<aside
			className={twJoin(
				`border-input-border relative mx-10 my-7 hidden h-[calc(100vh-28px-28px)] rounded-lg border p-4 shadow transition-all duration-300 lg:flex lg:flex-col`,
				desktopOpen && 'w-80',
				!desktopOpen && 'w-36 items-center'
			)}
		>
			<Button
				variant="outline"
				colorScheme="bland"
				isFullyRounded
				onClick={() => setDesktopOpen((prev) => !prev)}
				className="bg-background top-22 absolute -right-6 p-2"
			>
				<ChevronLast
					className={twJoin(
						'text-muted-foreground transition-transform duration-500',
						desktopOpen && 'rotate-180'
					)}
				/>
			</Button>

			{desktopOpen ? (
				<Volontera className="mx-4 mt-4" />
			) : (
				<Link href="/auth/login" className="mt-4">
					<Icon name="logo" className="size-20" />
				</Link>
			)}
			<hr className="bg-input-border my-6 h-px w-full border-0" />
			<div
				className={`no-scrollbar flex flex-col overflow-y-scroll ${desktopOpen ? 'gap-4' : 'gap-6'}`}
			>
				<Link href="/home">
					{desktopOpen ? (
						<SidebarItem
							iconLeft={<Home className="size-5" />}
							isSelected={pathname.includes('/home')}
						>
							Home
						</SidebarItem>
					) : (
						<SidebarItem
							isSelected={pathname.includes('/home')}
							size="lg"
							isFullyRounded
							className="p-4"
						>
							<Home className="size-8" />
						</SidebarItem>
					)}
				</Link>
				<Organizations />

				<Link href="/direct-messages">
					{desktopOpen ? (
						<SidebarItem
							iconLeft={<MessageCircleMore className="size-5" />}
							isSelected={pathname.includes('/direct-messages')}
						>
							Direct messages
						</SidebarItem>
					) : (
						<SidebarItem
							size="lg"
							isFullyRounded
							className="p-4"
							isSelected={pathname.includes('/direct-messages')}
						>
							<MessageCircleMore className="size-8" />
						</SidebarItem>
					)}
				</Link>
				<Link href="/settings">
					{desktopOpen ? (
						<SidebarItem
							iconLeft={<Settings className="size-5" />}
							isSelected={pathname.includes('/settings')}
						>
							Settings
						</SidebarItem>
					) : (
						<SidebarItem
							size="lg"
							isFullyRounded
							className="p-4"
							isSelected={pathname.includes('/settings')}
						>
							<Settings className="size-8" />
						</SidebarItem>
					)}
				</Link>
				<Link href="/help">
					{desktopOpen ? (
						<SidebarItem
							iconLeft={<HelpCircle className="size-5" />}
							isSelected={pathname.includes('/help')}
						>
							Help
						</SidebarItem>
					) : (
						<SidebarItem
							size="lg"
							isFullyRounded
							className="p-4"
							isSelected={pathname.includes('/help')}
						>
							<HelpCircle className="size-8" />
						</SidebarItem>
					)}
				</Link>

				{isAdminAccount(user.role) && (
					<Link href="/dashboard">
						{desktopOpen ? (
							<SidebarItem
								iconLeft={<ChartSpline className="size-5" />}
								isSelected={pathname.includes('/dashboard')}
							>
								Dashboard
							</SidebarItem>
						) : (
							<SidebarItem
								size="lg"
								isFullyRounded
								className="p-4"
								isSelected={pathname.includes('/dashboard')}
							>
								<ChartSpline className="size-8" />
							</SidebarItem>
						)}
					</Link>
				)}
			</div>
			<UserInformation user={user} />
		</aside>
	);
};
