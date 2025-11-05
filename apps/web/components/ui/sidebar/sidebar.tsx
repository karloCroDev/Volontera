'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
	ChevronLast,
	Circle,
	CircleX,
	Menu,
	PanelLeft,
	PanelsTopLeft,
	SidebarIcon,
	SidebarOpen,
	X,
} from 'lucide-react';
import * as Sheet from '@radix-ui/react-dialog';
import {
	Dialog,
	DialogTrigger,
	Heading,
	Input,
	Label,
	Modal,
	ModalOverlay,
	TextField,
} from 'react-aria-components';
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';
import { twJoin } from 'tailwind-merge';
import { LinkAsButton } from '@/components/ui/link-as-button';
import { Button } from '@/components/ui/button';
import { useSidebarContext } from '@/components/ui/sidebar/sidebar-provider';

export const Sidebar = () => {
	const { desktopOpen, mobileOpen, setMobileOpen, setDesktopOpen } =
		useSidebarContext();
	return (
		<>
			{/* Mobile trigger */}
			{/* <button className="p-2 md:hidden" onClick={() => setMobileOpen(true)}>
				<SidebarIcon className="size-6" />
			</button> */}

			{/* Desktop sidebar */}
			<aside
				className={twJoin(
					`border-input-border relative mx-10 my-12 hidden h-[calc(100vh-48px-48px)] rounded-2xl border transition-all duration-300 lg:flex`,
					desktopOpen ? 'w-80' : 'w-36'
				)}
			>
				<Button
					variant="outline"
					colorScheme="bland"
					isFullyRounded
					onClick={() => setDesktopOpen((prev) => !prev)}
					className="absolute -right-6 top-20 p-2"
				>
					<ChevronLast
						className={twJoin(
							'text-muted-foreground transition-transform duration-500',
							desktopOpen && 'rotate-180'
						)}
					/>
				</Button>
				{/* <div className="flex w-full flex-col gap-2 p-5">
					<LinkAsButton
						colorScheme="bland"
						variant="outline"
						href="/notifications"
					>
						{desktopOpen ? 'Dashboard' : 'D'}
					</LinkAsButton>
					<LinkAsButton href="/home">
						{desktopOpen ? 'Settings' : 'S'}
					</LinkAsButton>
				</div> */}
			</aside>

			{/* Mobile sheet */}

			<DialogTrigger isOpen={mobileOpen} onOpenChange={setMobileOpen}>
				<ModalOverlay
					isDismissable
					className="fixed inset-0 isolate z-20 flex min-h-full items-center justify-center overflow-y-auto bg-black/25 text-center backdrop-blur"
				>
					<Modal
						className={({ isEntering, isExiting }) =>
							twJoin(
								'bg-muted !z-max absolute left-0 top-0 h-full w-3/4 rounded-r-2xl px-2 py-4 duration-300 md:lg:w-1/4',
								isEntering && 'animate-in slide-in-from-left',
								isExiting && 'animate-out slide-out-to-left'
							)
						}
					>
						<Dialog>
							<form>
								<Heading slot="title">Sign up</Heading>
								<TextField autoFocus>
									<Label>First Name</Label>
									<Input />
								</TextField>
								<TextField>
									<Label>Last Name</Label>
									<Input />
								</TextField>
								<Button slot="close" style={{ marginTop: 8 }}>
									Clouse
								</Button>
							</form>
						</Dialog>
					</Modal>
				</ModalOverlay>
			</DialogTrigger>
		</>
	);
};
