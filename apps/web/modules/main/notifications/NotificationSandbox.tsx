'use client';

// External pakcages
import * as React from 'react';
import { Checkbox, Form } from 'react-aria-components';
import { ChevronDown } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { CheckboxVisually, CheckboxWithLabel } from '@/components/ui/checkbox';
import { Avatar } from '@/components/ui/avatar';
import Link from 'next/link';
import { Accordion } from '@/components/ui/accordion';

// Types
import { NotificationResponse } from '@repo/types/notification';
import { NotificationIdsArgs } from '@repo/schemas/notification';

export const NotificationSandbox: React.FC<{
	notifications: NotificationResponse['notifications'];
}> = ({ notifications }) => {
	const [ids, setIds] = React.useState<NotificationIdsArgs['notificationIds']>(
		[]
	);

	return (
		<Form className="border-input-border min-h-1/2 max-h-3/4 overflow-scroll rounded-xl border py-4">
			<div className="mb-4 flex items-center justify-between px-6">
				<CheckboxWithLabel
					checkboxVisuallyProps={{
						size: 'lg',
					}}
				>
					Select all
				</CheckboxWithLabel>
				<Button colorScheme="destructive" size="sm" isFullyRounded>
					Delete
				</Button>
			</div>

			<Accordion
				defaultValue="item-0"
				type="single"
				items={notifications.map((notification) => ({
					value: `item-${notification.id}`,
					trigger: (
						<div className="border-input-border flex w-full items-center gap-4 border-t px-6 py-3 lg:gap-6">
							<Checkbox
								className="group"
								onChange={(val) => {
									console.log(val);
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
										src: notification.user.image,
									}}
								>
									{notification.user.firstName +
										' ' +
										notification.user.lastName}
								</Avatar>

								<p className="text-muted-foreground text-sm underline-offset-2 hover:underline">
									{notification.user.firstName +
										' ' +
										notification.user.lastName}
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
				}))}
			/>
		</Form>
	);
};
