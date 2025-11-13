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
import {
	resetPasswordSettingsSchema,
	ResetPasswordSettingsSchemaArgs,
} from '@repo/schemas/settings';

export const PasswordDialog = () => {
	const {
		control,
		formState: { errors },
	} = useForm<ResetPasswordSettingsSchemaArgs>({
		resolver: zodResolver(resetPasswordSettingsSchema),
	});

	return (
		<Dialog
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
			<Form className="flex flex-col gap-6 lg:gap-8">
				<div>
					<Label className="text-base">Current password</Label>
					<Controller
						control={control}
						name="currentPassword"
						render={({ field }) => (
							<Input
								label="Password"
								className="mt-2"
								inputProps={field}
								error={errors.currentPassword?.message}
							/>
						)}
					/>
				</div>
				<div>
					<Label className="text-base">Repeat current password</Label>
					<Controller
						control={control}
						name="repeatCurrentPassword"
						render={({ field }) => (
							<Input
								label="Password"
								className="mt-2"
								inputProps={field}
								error={errors.repeatCurrentPassword?.message}
							/>
						)}
					/>
				</div>
				<div>
					<Label className="text-base">Old password</Label>
					<Controller
						control={control}
						name="newPassword"
						render={({ field }) => (
							<Input
								label="Password"
								className="mt-2"
								inputProps={field}
								error={errors.newPassword?.message}
							/>
						)}
					/>
				</div>

				<Button className="ml-auto self-end">Save</Button>
			</Form>
		</Dialog>
	);
};
