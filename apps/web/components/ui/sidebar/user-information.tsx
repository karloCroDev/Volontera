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
	Popover,
} from 'react-aria-components';
import { twJoin } from 'tailwind-merge';
import { useRouter } from 'next/navigation';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LinkAsButton } from '@/components/ui/link-as-button';
import { useSidebarContext } from '@/components/ui/sidebar/sidebar-provider';

// Hooks
import { useLogout } from '@/hooks/data/user';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';

// Types
import { SessionSuccessResponse } from '@repo/types/auth';
import { convertToFullname } from '@/lib/utils/convert-to-fullname';

export const UserInformation: React.FC<{
	user: SessionSuccessResponse;
}> = withReactQueryProvider(({ user }) => {
	const router = useRouter();
	const { desktopOpen } = useSidebarContext();

	const { mutate, isPending } = useLogout();

	const subscriptionTier =
		user.subscriptionTier[0]?.toUpperCase() +
		user.subscriptionTier.slice(1).toLowerCase();

	console.log(user);
	return (
		<>
			<p className="text-muted-foreground mb-3 mt-auto text-start">
				{desktopOpen ? `Current plan: ${subscriptionTier}` : subscriptionTier}
			</p>
			<DialogTrigger>
				{desktopOpen ? (
					<AriaButton className="border-input-border bg-muted hover:bg-muted/80 flex h-fit w-full cursor-pointer items-center gap-4 rounded-lg border p-3 outline-none sm:w-3/4 md:w-3/5 lg:w-full">
						<Avatar
							imageProps={{
								src: user.image ?? undefined,
							}}
							colorScheme="gray"
							size="md"
						>
							{convertToFullname({
								firstname: user.firstName,
								lastname: user.lastName,
							})}
						</Avatar>
						<div>
							<p className="flex items-center justify-between">
								{convertToFullname({
									firstname: user.firstName,
									lastname: user.lastName,
								})}
							</p>
							<p className="text-muted-foreground text-sm">{user.email}</p>
						</div>

						<EllipsisVertical className="text-muted-foreground ml-auto" />
					</AriaButton>
				) : (
					<AriaButton>
						<Avatar
							imageProps={{
								src: user?.image || '',
							}}
							colorScheme="gray"
							size="xl"
							className="cursor-pointer hover:opacity-65"
						>
							{convertToFullname({
								firstname: user.firstName,
								lastname: user.lastName,
							})}
						</Avatar>
					</AriaButton>
				)}
				<Popover
					className={twJoin(
						'data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:slide-in-from-bottom-1.5 data-[exiting]:slide-out-to-bottom-1.5 data-[entering]:fade-in data-[exiting]:fade-out w-[var(--trigger-width)] duration-300 lg:w-[286px]'
					)}
					placement={!desktopOpen ? 'right bottom' : 'top'}
				>
					<Dialog>
						<div className="bg-muted border-input-border flex flex-col gap-3 rounded-lg border px-4 py-3">
							<div className="flex items-center gap-4">
								<Avatar
									imageProps={{
										src: user?.image || '',
									}}
									colorScheme="gray"
									size="md"
								>
									{convertToFullname({
										firstname: user.firstName,
										lastname: user.lastName,
									})}
								</Avatar>
								<div>
									<p className="flex items-center justify-between">
										{convertToFullname({
											firstname: user.firstName,
											lastname: user.lastName,
										})}
									</p>
									<p className="text-muted-foreground text-sm">{user.email}</p>
								</div>
							</div>
							<hr className="bg-input-border h-px w-full border-0" />
							<ul>
								<li>
									<LinkAsButton
										href="/public-profile"
										variant="ghost"
										iconLeft={<CircleUserRound className="size-4" />}
										size="sm"
										className="w-full justify-start px-2"
									>
										Public profile
									</LinkAsButton>
								</li>
								<li>
									<LinkAsButton
										href="/select-plan"
										variant="ghost"
										iconLeft={<CreditCard className="size-4" />}
										size="sm"
										className="flex w-full items-center justify-start px-2"
									>
										Manage plans
										<p className="text-muted-foreground ml-auto text-xs">
											{user.subscriptionTier === 'PRO' ? 'Premium' : 'Free'}
										</p>
									</LinkAsButton>
								</li>
							</ul>
							<hr className="bg-input-border h-px w-full border-0" />
							<Button
								colorScheme="destructive"
								iconLeft={<LogOut className="size-4" />}
								size="sm"
								className="w-full justify-start"
								onPress={() => {
									mutate(undefined, {
										onSuccess: () => {
											router.push('/auth/login');
										},
									});
								}}
								isLoading={isPending}
								isDisabled={isPending}
							>
								Log out
							</Button>
						</div>
					</Dialog>
				</Popover>
			</DialogTrigger>
		</>
	);
});
