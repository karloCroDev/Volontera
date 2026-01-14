'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	LeaveOrganizationArgs,
	leaveOrganizationSchema,
} from '@repo/schemas/organization-managment';
import { useParams, useRouter } from 'next/navigation';

// Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Hooks
import { useLeaveOrganization } from '@/hooks/data/organization-managment';

// Lib
import { toast } from '@/lib/utils/toast';

export const LeaveOrganizationDialog = () => {
	const params = useParams<{ organizationId: string }>();
	const {
		handleSubmit,
		control,
		setError,
		formState: { errors, isDirty },
	} = useForm<LeaveOrganizationArgs>({
		resolver: zodResolver(leaveOrganizationSchema),
		defaultValues: {
			organizationId: params.organizationId,
			reason: '',
		},
	});

	const router = useRouter();
	const { mutate, isPending } = useLeaveOrganization();
	const onSubmit = (data: LeaveOrganizationArgs) => {
		mutate(data, {
			onSuccess: ({ message, title }) => {
				router.push('/home');
				toast({
					title,
					content: message,
					variant: 'success',
				});
			},
			onError: (error) => {
				setError('reason', error);
			},
		});
	};

	return (
		<Dialog
			triggerChildren={
				<Button variant="outline" colorScheme="destructive" size="md">
					Leave
				</Button>
			}
		>
			<Form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-4 overflow-y-scroll"
			>
				<div>
					<Label isOptional className="mb-2">
						{' '}
						Please tell us why you are leaving
					</Label>

					<Controller
						control={control}
						name="reason"
						render={({ field }) => (
							<Textarea
								className="mt-2"
								label="Enter your reason..."
								textAreaProps={field}
								error={errors.reason?.message}
							/>
						)}
					/>
				</div>

				<Button
					isDisabled={!isDirty || isPending}
					isLoading={isPending}
					type="submit"
				>
					{' '}
					Leave
				</Button>
			</Form>
		</Dialog>
	);
};
