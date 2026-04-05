'use client';

// External packages
import {
	ChartSpline,
	HelpCircle,
	Home,
	MessageCircleMore,
	Settings,
	X,
} from 'lucide-react';
import {
	Dialog,
	DialogTrigger,
	Modal,
	ModalOverlay,
} from 'react-aria-components';
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

// Types
import { UserResponse } from '@repo/types/user';
import { isAdminAccount } from '@repo/permissons/index';

export const MobileSidebar: React.FC<{
	user: UserResponse;
}> = ({
	// eslint-disable-next-line react/prop-types
	user,
}) => {
	const { mobileOpen, setMobileOpen } = useSidebarContext();
	const pathname = usePathname();

	return (
		<DialogTrigger isOpen={mobileOpen} onOpenChange={setMobileOpen}>
			<ModalOverlay
				isDismissable
				className="fixed inset-0 isolate z-20 flex items-center justify-center overflow-y-auto bg-black/25 text-center backdrop-blur"
			>
				<Modal
					className={({ isEntering, isExiting }) =>
						twJoin(
							'bg-muted !z-max border-input-border absolute left-0 top-0 m-2 h-[calc(100%-16px)] w-3/4 rounded-xl border px-2 py-4 duration-300 md:lg:w-1/4',
							isEntering && 'animate-in slide-in-from-left',
							isExiting && 'animate-out slide-out-to-left'
						)
					}
				>
					<Dialog className="flex h-full flex-col">
						<div className="mb-4 flex items-center justify-between px-2">
							<Volontera />

							<Button slot="close" isFullyRounded className="p-2">
								<X />
							</Button>
						</div>
						<hr className="bg-input-border mb-6 h-px border-0" />

						<div className="flex w-3/4 flex-col gap-2 md:w-3/5">
							<div className="flex flex-1 flex-col gap-4">
								<Link href="/home">
									<SidebarItem
										iconLeft={<Home className="size-5" />}
										isSelected={pathname.includes('/home')}
									>
										Home
									</SidebarItem>
								</Link>
								<Organizations />
							</div>

							<Link href="/direct-messages">
								<SidebarItem
									iconLeft={<MessageCircleMore className="size-5" />}
									isSelected={pathname.includes('/direct-messages')}
								>
									Direct messages
								</SidebarItem>
							</Link>
							<Link href="/settings">
								<SidebarItem
									iconLeft={<Settings className="size-5" />}
									isSelected={pathname.includes('/settings')}
								>
									Settings
								</SidebarItem>
							</Link>
							<Link href="/help">
								<SidebarItem
									iconLeft={<HelpCircle className="size-5" />}
									isSelected={pathname.includes('/help')}
								>
									Help
								</SidebarItem>
							</Link>
							{isAdminAccount(user.role) && (
								<Link href="/dashboard">
									<SidebarItem
										iconLeft={<ChartSpline className="size-5" />}
										isSelected={pathname.includes('/dashboard')}
									>
										Dashboard
									</SidebarItem>
								</Link>
							)}
						</div>
						<div className="mt-auto">
							<UserInformation user={user} />
						</div>
					</Dialog>
				</Modal>
			</ModalOverlay>
		</DialogTrigger>
	);
};
