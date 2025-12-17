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

export const CurrentUsersForm = () => {
	const [ids, setIds] = React.useState<NotificationIdsArgs['notificationIds']>(
		[]
	);
	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};
	return (
		<Form
			className="border-input-border min-h-1/2 max-h-3/4 overflow-scroll rounded-xl border py-1"
			onSubmit={onSubmit}
		>
			{[...Array(3)].map((_, indx) => (
				<div
					className="border-input-border flex w-full items-center gap-4 border-b px-6 py-3 lg:gap-6"
					key={indx}
				>
					<Checkbox
						className="group"
						// isSelected={ids.includes(notification.id)}
						onChange={(val) => {
							// if (val) {
							// 	setIds((prev) => [...prev, notification.id]);
							// } else {
							// 	setIds((prev) =>
							// 		prev.filter((id) => id !== notification.id)
							// 	);
							// }
						}}
					>
						<CheckboxVisually
							// variant={notification.isRead ? 'suiccess' : 'secondary'}
							variant="secondary"
						/>
					</Checkbox>

					<Link href="/" className="flex items-center gap-4">
						<Avatar
							size="sm"
							imageProps={{
								src: '',
							}}
						>
							AAA
						</Avatar>

						<p className="text-muted-foreground text-sm underline-offset-2 hover:underline">
							AAA
						</p>
					</Link>

					<div className="ml-auto flex gap-3">
						<Button isFullyRounded colorScheme="success">
							Set to admin
						</Button>
						<Button isFullyRounded colorScheme="yellow">
							Remove admin role
						</Button>
						<Button isFullyRounded colorScheme="destructive">
							Banned
						</Button>
					</div>
				</div>
			))}
		</Form>
	);
};
