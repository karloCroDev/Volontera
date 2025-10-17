'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Error } from '@/components/ui/error';

// Hooks
import { useResetPassword } from '@/hooks/data/auth';

// Schemas
import { ResetPasswordArgs, resetPasswordSchema } from '@repo/schemas/auth';

export const ResetPasswordForm = () => {
	const { isPending, mutate } = useResetPassword();
	const {
		control,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<ResetPasswordArgs>({
		resolver: zodResolver(resetPasswordSchema),
	});

	const onSubmit = async (data: ResetPasswordArgs) => {
		mutate(data, {
			onSuccess({ message, success }) {
				if (!success) {
					return setError('root', {
						message,
					});
				}
			},
		});
	};

	return (
		<Form
			className="mt-12 flex flex-col gap-8 lg:mt-16"
			onSubmit={handleSubmit(onSubmit)}
		>
			<div>
				<Label htmlFor="password">Password</Label>
				<Controller
					control={control}
					name="password"
					render={({ field }) => (
						<Input
							id="password"
							label="Enter your new password..."
							className="mt-2"
							error={errors.password?.message}
							{...field}
						/>
					)}
				/>
			</div>
			<div>
				<Label htmlFor="repeat-password">Repeat password</Label>

				<Controller
					control={control}
					name="repeatPassword"
					render={({ field }) => (
						<Input
							id="repeat-password"
							label="Repeat your new password..."
							className="mt-2"
							error={errors.repeatPassword?.message}
							{...field}
						/>
					)}
				/>
			</div>

			{errors.root && <Error>{errors.root.message}</Error>}

			<Button
				className="w-full"
				size="lg"
				colorScheme="orange"
				isDisabled={isPending}
			>
				Reset password
			</Button>
		</Form>
	);
};
