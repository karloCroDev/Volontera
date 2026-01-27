'use client';

// External packages
import * as React from 'react';
import {
	CircleUserRound,
	CreditCard,
	EllipsisVertical,
	LogOut,
	SunMoon,
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
import { UserResponse } from '@repo/types/user';
import { convertToFullname, convertToPascalCase } from '@/lib/utils/converter';
import { useTheme } from 'next-themes';

export const UserInformation: React.FC<{
	user: UserResponse;
}> = withReactQueryProvider(({ user }) => {
	const router = useRouter();
	const { desktopOpen } = useSidebarContext();

	const { mutate, isPending } = useLogout();
	const { theme, setTheme } = useTheme();

	return (
		<>
			<div className="mb-3 mt-auto">
				<p className="text-muted-foreground text-start">
					{desktopOpen
						? `Current plan: ${convertToPascalCase(user.subscriptionTier)}`
						: convertToPascalCase(user.subscriptionTier)}
				</p>
				<p className="text-muted-foreground text-start">
					{desktopOpen
						? `Type: ${convertToPascalCase(user.role!)}`
						: convertToPascalCase(user.role!)}
				</p>
			</div>

			<DialogTrigger>
				{desktopOpen ? (
					<AriaButton className="border-input-border bg-muted hover:bg-muted/80 flex h-fit w-full cursor-pointer items-center gap-4 rounded-lg border p-3 shadow-md outline-none sm:w-3/4 md:w-3/5 lg:w-full">
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
										href={`/profile/${user.id}`}
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
								<li className="lg:hidden">
									<Button
										variant="ghost"
										iconLeft={<SunMoon className="size-4" />}
										size="sm"
										className="w-full justify-start px-2"
										onPress={() =>
											setTheme(theme === 'dark' ? 'light' : 'dark')
										}
									>
										Change theme
									</Button>
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
