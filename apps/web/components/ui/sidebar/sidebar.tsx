'use client';

// External packages
import {
	ChevronLast,
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

// Components
import { Button } from '@/components/ui/button';
import { useSidebarContext } from '@/components/ui/sidebar/sidebar-provider';
import { UserInformation } from '@/components/ui/sidebar/user-information';
import {
	Organizations,
	SidebarItem,
} from '@/components/ui/sidebar/sidebar-items';
import { UserResponse } from '@repo/types/user';

export const Sidebar: React.FC<{
	user: UserResponse;
}> = ({ /* eslint react/prop-types: 0 */ user }) => {
	const { desktopOpen, mobileOpen, setMobileOpen, setDesktopOpen } =
		useSidebarContext();
	return (
		<>
			<aside
				className={twJoin(
					`border-input-border relative mx-10 my-7 hidden h-[calc(100vh-28px-28px)] rounded-2xl border p-4 transition-all duration-300 lg:flex lg:flex-col`,
					desktopOpen && 'w-80',
					!desktopOpen && 'w-36 items-center'
				)}
			>
				<Button
					variant="outline"
					colorScheme="bland"
					isFullyRounded
					onClick={() => setDesktopOpen((prev) => !prev)}
					className="bg-background absolute -right-6 top-20 z-[1] p-2"
				>
					<ChevronLast
						className={twJoin(
							'text-muted-foreground transition-transform duration-500',
							desktopOpen && 'rotate-180'
						)}
					/>
				</Button>

				<div className={`flex flex-col ${desktopOpen ? 'gap-4' : 'gap-6'}`}>
					<Link href="/home">
						{desktopOpen ? (
							<SidebarItem iconLeft={<Home className="size-5" />} isSelected>
								Home
							</SidebarItem>
						) : (
							<SidebarItem isSelected size="lg" isFullyRounded className="p-4">
								<Home className="size-8" />
							</SidebarItem>
						)}
					</Link>
					<Organizations />

					<Link href="/direct-messages">
						{desktopOpen ? (
							<SidebarItem iconLeft={<MessageCircleMore className="size-5" />}>
								Direct messages
							</SidebarItem>
						) : (
							<SidebarItem size="lg" isFullyRounded className="p-4">
								<MessageCircleMore className="size-8" />
							</SidebarItem>
						)}
					</Link>
					<Link href="/settings">
						{desktopOpen ? (
							<SidebarItem iconLeft={<Settings className="size-5" />}>
								Settings
							</SidebarItem>
						) : (
							<SidebarItem size="lg" isFullyRounded className="p-4">
								<Settings className="size-8" />
							</SidebarItem>
						)}
					</Link>
					<Link href="/help">
						{desktopOpen ? (
							<SidebarItem iconLeft={<HelpCircle className="size-5" />}>
								Help
							</SidebarItem>
						) : (
							<SidebarItem size="lg" isFullyRounded className="p-4">
								<HelpCircle className="size-8" />
							</SidebarItem>
						)}
					</Link>
				</div>
				<UserInformation user={user} />
			</aside>

			{/* Mobile sidebar */}

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
								<p className="text-md">[app name]</p>
								<Button slot="close" isFullyRounded className="p-2">
									<X />
								</Button>
							</div>

							<div>
								<div className="flex w-3/4 flex-1 flex-col gap-4 md:w-3/5">
									<Link href="/home">
										<SidebarItem
											iconLeft={<Home className="size-5" />}
											isSelected
										>
											Home
										</SidebarItem>
									</Link>
									<Organizations />
								</div>

								<Link href="/direct-messages">
									<SidebarItem
										iconLeft={<MessageCircleMore className="size-5" />}
									>
										Direct messages
									</SidebarItem>
								</Link>
								<Link href="/settings">
									<SidebarItem iconLeft={<Settings className="size-5" />}>
										Settings
									</SidebarItem>
								</Link>
								<Link href="/help">
									<SidebarItem iconLeft={<HelpCircle className="size-5" />}>
										Help
									</SidebarItem>
								</Link>
							</div>
							<div className="mt-auto">
								<UserInformation user={user} />
							</div>
						</Dialog>
					</Modal>
				</ModalOverlay>
			</DialogTrigger>
		</>
	);
};
