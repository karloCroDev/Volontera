'use client';

// External packages
import * as React from 'react';
import { Plus } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Form } from 'react-aria-components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';

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

export const CreateChannelDialog = () => {
	const params = useParams<{ organizationId: string; channelId: string }>();
	const {
		control,
		formState: { errors },
		handleSubmit,
	} = useForm({
		resolver: zodResolver(createOrganizationChannelSchema),
		defaultValues: {
			organizationId: params.organizationId,
			channelName: '',
			description: '',
		},
	});

	const onSubmit = (data: CreateOrganizationChannelArgs) => {};
	return (
		<Dialog
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

				<Button type="submit" className="self-end">
					Submit
				</Button>
			</Form>
		</Dialog>
	);
};
