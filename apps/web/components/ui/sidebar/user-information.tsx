'use client';

// External packages
import * as React from 'react';
import {
	CircleUserRound,
	CreditCard,
	EllipsisVertical,
	LogOut,
} from 'lucide-react';
import {
	Button as AriaButton,
	Dialog,
	DialogTrigger,
	OverlayArrow,
	Popover,
	Switch,
} from 'react-aria-components';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LinkAsButton } from '@/components/ui/link-as-button';
import { useSidebarContext } from '@/components/ui/sidebar/sidebar-provider';
import { twJoin } from 'tailwind-merge';

export const UserInformation = () => {
	const { desktopOpen } = useSidebarContext();
	return (
		<DialogTrigger>
			{desktopOpen ? (
				<AriaButton className="border-input-border bg-muted hover:bg-muted/80 flex h-fit w-full cursor-pointer items-center gap-4 rounded-lg border p-3 outline-none">
					<Avatar
						imageProps={{
							src: '',
						}}
						variant="secondary"
						size="md"
					>
						Ivan Horvat
					</Avatar>
					<div>
						<div className="flex items-center justify-between">
							<p>Ivan Horvat</p>
						</div>
						<p className="text-muted-foreground text-sm">ivanhorvat@test.com</p>
					</div>

					<EllipsisVertical className="text-muted-foreground ml-auto" />
				</AriaButton>
			) : (
				<AriaButton>
					<Avatar
						imageProps={{
							src: '',
						}}
						variant="secondary"
						size="xl"
						className="cursor-pointer hover:opacity-65"
					>
						Ivan Horvat
					</Avatar>
				</AriaButton>
			)}
			<Popover
				className={twJoin(
					'data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:slide-in-from-bottom-1.5 data-[exiting]:slide-out-to-bottom-1.5 data-[entering]:fade-in data-[exiting]:fade-out w-[286px] duration-300'
					// desktopOpen && 'w-[var(--trigger-width)]' Vidi kako cu ovo handleati
				)}
				placement={!desktopOpen ? 'right bottom' : 'top'}
			>
				<Dialog>
					<div className="bg-muted border-input-border flex flex-col gap-3 rounded-lg border px-4 py-3">
						<div className="flex items-center gap-4">
							<Avatar
								imageProps={{
									src: '',
								}}
								variant="secondary"
								size="md"
							>
								Ivan Horvat
							</Avatar>
							<div>
								<div className="flex items-center justify-between">
									<p>Ivan Horvat</p>
								</div>
								<p className="text-muted-foreground text-sm">
									ivanhorvat@test.com
								</p>
							</div>
						</div>
						<hr className="bg-input-border h-px w-full border-0" />
						<ul>
							<li>
								<LinkAsButton
									href="/public-profile"
									variant="blank"
									iconLeft={<CircleUserRound className="size-4" />}
									size="sm"
									className="w-full justify-start px-0"
								>
									Public profile
								</LinkAsButton>
							</li>
							<li>
								<div className="flex items-center justify-between">
									<LinkAsButton
										href="/public-profile"
										variant="blank"
										iconLeft={<CreditCard className="size-4" />}
										size="sm"
										className="w-full justify-start px-0"
									>
										Manage plans
									</LinkAsButton>
									<p className="text-muted-foreground text-xs">Free</p>
								</div>
							</li>
						</ul>
						<hr className="bg-input-border h-px w-full border-0" />
						<Button
							variant="blank"
							iconLeft={<LogOut className="size-4" />}
							size="sm"
							className="w-full justify-start px-0"
						>
							Log out
						</Button>
					</div>
				</Dialog>
			</Popover>
		</DialogTrigger>
	);
};
