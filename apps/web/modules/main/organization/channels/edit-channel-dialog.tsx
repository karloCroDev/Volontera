'use client';

// External packages
import * as React from 'react';
import { Pen } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Form } from 'react-aria-components';
import { zodResolver } from '@hookform/resolvers/zod';

// Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Scheamas
import {
	UpdateOrganizationChannelArgs,
	updateOrganizationChannelSchema,
} from '@repo/schemas/organization-channel';

// Hooks
import { useUpdateOrganizationChannel } from '@/hooks/data/organization-channel';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { toast } from '@/lib/utils/toast';

export const EditChannelDialog: React.FC<{
	channelId: string;
	channelName: string;
	description: string;
	organizationId: string;
}> = withReactQueryProvider(
	({ channelId, channelName, description, organizationId }) => {
		const { mutate } = useUpdateOrganizationChannel();
		const {
			control,
			formState: { errors },
			handleSubmit,
		} = useForm({
			resolver: zodResolver(updateOrganizationChannelSchema),
			defaultValues: {
				channelId,
				organizationId,
				channelName,
				description,
			},
		});

		const [isOpen, setIsOpen] = React.useState(false);
		const onSubmit = (data: UpdateOrganizationChannelArgs) => {
			mutate(data, {
				onSuccess: ({ message, title }) => {
					toast({
						title,
						content: message,
						variant: 'success',
					});
					setIsOpen(false);
				},
				onError: ({ message, title }) => {
					toast({
						title,
						content: message,
						variant: 'error',
					});
				},
			});
		};
		return (
			<Dialog
				onOpenChange={setIsOpen}
				isOpen={isOpen}
				triggerChildren={
					<Button variant="ghost" isFullyRounded className="p-3">
						<Pen className="size-5" />
					</Button>
				}
				title="Edit channel"
				subtitle="Update your channel details"
			>
				<Form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
					<div>
						<Label className="mb-2">Name</Label>
						<Controller
							control={control}
							name="channelName"
							render={({ field }) => (
								<Input
									label="Enter your channel name"
									inputProps={field}
									error={errors.channelName?.message}
								/>
							)}
						/>
					</div>
					<div>
						<Label className="mb-2">Description</Label>
						<Controller
							control={control}
							name="description"
							render={({ field }) => (
								<Input
									label="Enter your channel description"
									inputProps={field}
									error={errors.description?.message}
								/>
							)}
						/>
					</div>

					<Button type="submit" className="self-end">
						Edit
					</Button>
				</Form>
			</Dialog>
		);
	}
);
