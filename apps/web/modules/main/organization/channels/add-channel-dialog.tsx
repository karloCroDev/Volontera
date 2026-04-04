'use client';

// External packages
import * as React from 'react';
import { Plus } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Form } from 'react-aria-components';
import { zodResolver } from '@hookform/resolvers/zod';

// Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Schemas
import {
	CreateOrganizationChannelArgs,
	createOrganizationChannelSchema,
} from '@repo/schemas/organization-channel';

// Hooks
import { useCreateOrganizationChannel } from '@/hooks/data/organization-channel';
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { toast } from '@/lib/utils/toast';

export const CreateChannelDialog: React.FC<{
	organizationId: string;
}> = withReactQueryProvider(({ organizationId }) => {
	const { mutate } = useCreateOrganizationChannel(organizationId);
	const {
		control,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm({
		resolver: zodResolver(createOrganizationChannelSchema),
		defaultValues: {
			organizationId,
			channelName: '',
			description: '',
		},
	});

	const [isOpen, setIsOpen] = React.useState(false);
	const onSubmit = (data: CreateOrganizationChannelArgs) => {
		mutate(data, {
			onSuccess: ({ message, title }) => {
				toast({
					title,
					content: message,
					variant: 'success',
				});
				setIsOpen(false);
				reset();
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
			triggerChildren={<Button iconRight={<Plus />}> Create channel</Button>}
			title="Create new channel"
			subtitle="Create a new channel to start chatting with your organization members"
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
				{errors.root?.message}
				<Button type="submit" className="self-end">
					Submit
				</Button>
			</Form>
		</Dialog>
	);
});
