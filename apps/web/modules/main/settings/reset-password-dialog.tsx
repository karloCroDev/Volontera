'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';
import { Controller, useForm } from 'react-hook-form';
import { twJoin } from 'tailwind-merge';
import { zodResolver } from '@hookform/resolvers/zod';

// Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { getTextFieldBasicStyles, Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Schemas
import {
	resetPasswordSettingsSchema,
	ResetPasswordSettingsArgs,
} from '@repo/schemas/settings';

// Hooks
import { useResetPasswordInApp } from '@/hooks/data/settings';

// Lib
import { toast } from '@/lib/utils/toast';

export const PasswordDialog = () => {
	const {
		control,
		formState: { errors },
		handleSubmit,
		setError,
		reset,
	} = useForm<ResetPasswordSettingsArgs>({
		resolver: zodResolver(resetPasswordSettingsSchema),
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			repeatNewPassword: '',
		},
	});

	const { mutate, isPending } = useResetPasswordInApp();

	const [handleDialog, setHandleDialog] = React.useState(false);

	const onSubmit = (data: ResetPasswordSettingsArgs) => {
		mutate(data, {
			onSuccess({ title, message }) {
				toast({
					title,
					content: message,
					variant: 'success',
				});

				reset();
				setHandleDialog(false);
			},
			onError(err) {
				setError('root', err);
			},
		});
	};
	return (
		<Dialog
			onOpenChange={setHandleDialog}
			isOpen={handleDialog}
			triggerChildren={
				<Button
					variant="blank"
					className={twJoin(
						getTextFieldBasicStyles,
						'mt-2 flex items-center justify-between px-4'
					)}
					iconRight={<div className="ml-auto mt-2">********</div>}
				>
					Change your password
				</Button>
			}
			title="Reset password"
			subtitle="Reset your current password"
		>
			<Form
				className="flex flex-col gap-6 lg:gap-8"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div>
					<Label className="text-base">Current password</Label>
					<Controller
						control={control}
						name="currentPassword"
						render={({ field }) => (
							<Input
								label="Current password"
								className="mt-2"
								inputProps={{
									...field,
									type: 'password',
								}}
								error={errors.currentPassword?.message}
							/>
						)}
					/>
				</div>
				<div>
					<Label className="text-base">New password</Label>
					<Controller
						control={control}
						name="newPassword"
						render={({ field }) => (
							<Input
								label="New password"
								className="mt-2"
								inputProps={{
									...field,
									type: 'password',
								}}
								error={errors.newPassword?.message}
							/>
						)}
					/>
				</div>
				<div>
					<Label className="text-base">Repeat new password</Label>
					<Controller
						control={control}
						name="repeatNewPassword"
						render={({ field }) => (
							<Input
								label="Repeat new password"
								className="mt-2"
								inputProps={{
									...field,
									type: 'password',
								}}
								error={errors.repeatNewPassword?.message}
							/>
						)}
					/>
				</div>

				<Button
					className="ml-auto self-end"
					isLoading={isPending}
					type="submit"
				>
					Save
				</Button>
			</Form>
		</Dialog>
	);
};
