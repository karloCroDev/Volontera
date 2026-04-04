'use client';

// External packages
import * as React from 'react';
import { Plus } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Form } from 'react-aria-components';

// Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const CreateChannelDialog = () => {
	const { control } = useForm();
	return (
		<Dialog
			triggerChildren={<Button iconRight={<Plus />}> Create channel</Button>}
			title="Create new channel"
			subtitle="Create a new channel to start chatting with your organization members"
		>
			<Form className="flex flex-col gap-4">
				<div>
					<Label className="mb-2">Name</Label>
					<Controller
						control={control}
						name="name"
						render={({ field }) => (
							<Input
								label="Enter your channel name"
								inputProps={field}
								// error={errors.title?.message}
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
								// error={errors.title?.message}
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
