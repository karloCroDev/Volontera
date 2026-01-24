'use client';

// External pakcages
import * as React from 'react';
import { Checkbox, Form } from 'react-aria-components';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

// Components
import { Button } from '@/components/ui/button';
import { CheckboxVisually, CheckboxWithLabel } from '@/components/ui/checkbox';
import { Avatar } from '@/components/ui/avatar';
import { Accordion } from '@/components/ui/accordion';

// Types
import { NotificationResponse } from '@repo/types/notification';

// Schemas
import { NotificationIdsArgs } from '@repo/schemas/notification';

// Hokks
import { useDeleteNotifications } from '@/hooks/data/notification';

// Lib
import { toast } from '@/lib/utils/toast';
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { IRevalidateTag } from '@/lib/server/revalidation';
import { convertToFullname } from '@/lib/utils/converter';

export const NotificationSandbox: React.FC<{
	notifications: NotificationResponse['notifications'];
}> = withReactQueryProvider(({ notifications }) => {
	const [ids, setIds] = React.useState<NotificationIdsArgs['notificationIds']>(
		[]
	);

	const { mutate, isPending } = useDeleteNotifications();

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		mutate(
			{
				notificationIds: ids,
			},
			{
				onSuccess: () => {
					setIds([]);
					toast({
						title: 'Notifications deleted',
						content: 'Selected notifications have been deleted successfully',
						variant: 'success',
					});
					IRevalidateTag('notification-user');
				},
				onError: ({ message, title }) => {
					toast({
						title,
						content: message,
						variant: 'error',
					});
				},
			}
		);
	};
	return (
		<Form
			className="border-input-border min-h-1/2 max-h-3/4 overflow-scroll rounded-xl border shadow-xl"
			onSubmit={onSubmit}
		>
			<div className="bg-muted flex items-center justify-between px-6 py-4">
				<CheckboxWithLabel
					checkboxVisuallyProps={{
						size: 'lg',
					}}
					onChange={(val) => {
						return val ? setIds(notifications.map((n) => n.id)) : setIds([]);
					}}
				>
					Select all
				</CheckboxWithLabel>
				<Button
					colorScheme="destructive"
					size="sm"
					isFullyRounded
					isLoading={isPending}
					type="submit"
				>
					Delete
				</Button>
			</div>

			<Accordion
				type="multiple"
				items={
					notifications.length > 0
						? notifications.map((notification) => ({
								value: `item-${notification.id}`,
								trigger: (
									<div className="border-input-border flex w-full items-center gap-4 border-t px-6 py-3 lg:gap-6">
										<Checkbox
											className="group"
											isSelected={ids.includes(notification.id)}
											onChange={(val) => {
												if (val) {
													setIds((prev) => [...prev, notification.id]);
												} else {
													setIds((prev) =>
														prev.filter((id) => id !== notification.id)
													);
												}
											}}
										>
											<CheckboxVisually
												variant={notification.isRead ? 'suiccess' : 'secondary'}
											/>
										</Checkbox>

										<Link href="/" className="flex items-center gap-4">
											<Avatar
												size="sm"
												imageProps={{
													src: notification?.user.image || '',
												}}
												isVerified={
													notification.user.subscriptionTier === 'PRO'
												}
											>
												{convertToFullname({
													firstname: notification.user.firstName,
													lastname: notification.user.lastName,
												})}
											</Avatar>

											<p className="text-muted-foreground text-sm underline-offset-2 hover:underline">
												{convertToFullname({
													firstname: notification.user.firstName,
													lastname: notification.user.lastName,
												})}
											</p>
										</Link>

										<ChevronDown className="ml-auto transition-transform duration-300 group-data-[state=closed]:rotate-0 group-data-[state=open]:rotate-180" />
									</div>
								),
								contentProps: {
									children: (
										<div className="p-4">
											<p>{notification.content}</p>
										</div>
									),
								},
							}))
						: []
				}
			/>
		</Form>
	);
});
