'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
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

export const Sidebar = () => {
	const [open, setOpen] = useState(true);
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<>
			{/* Mobile trigger */}
			<button className="p-2 md:hidden" onClick={() => setMobileOpen(true)}>
				<SidebarIcon className="size-6" />
			</button>

			{/* Desktop sidebar */}
			<div
				className={twJoin(
					`hidden h-screen overflow-hidden border-r transition-all duration-300 md:flex`,
					open ? 'w-60' : 'w-14'
				)}
			>
				<div className="flex w-full flex-col gap-2 p-2">
					<LinkAsButton variant="blank" href="/">
						{open ? 'Dashboard' : 'D'}
					</LinkAsButton>
					<LinkAsButton href="/settings">
						{open ? 'Settings' : 'S'}
					</LinkAsButton>
				</div>
			</div>
			<Button variant="blank" onClick={() => setOpen(!open)}>
				<PanelsTopLeft className="text-muted-foreground hidden size-6 lg:block" />
			</Button>

			{/* Mobile sheet */}

			<DialogTrigger isOpen={mobileOpen} onOpenChange={setMobileOpen}>
				<ModalOverlay
					isDismissable
					className="fixed inset-0 isolate z-20 flex min-h-full items-center justify-center overflow-y-auto bg-black/25 text-center backdrop-blur"
				>
					<div className="bg-muted !z-max absolute left-0 top-0 h-full w-3/4 px-2 py-4 md:lg:w-1/4">
						<Modal className="h-full">
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
					</div>
				</ModalOverlay>
			</DialogTrigger>
		</>
	);
};
