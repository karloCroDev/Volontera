'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';

// Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useResetPassword } from '@/hooks/data/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ResetPasswordArgs, resetPasswordSchema } from '@repo/schemas/auth';

export const ResetPasswordForm = () => {
	const { isPending, mutate } = useResetPassword();
	const {
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
				<Input
					id="password"
					label="Enter your new password..."
					className="mt-2"
					error={errors.password?.message}
				/>
			</div>
			<div>
				<Label htmlFor="repeat-password">Repeat password</Label>
				<Input
					id="repeat-password"
					label="Repeat your new password..."
					className="mt-2"
					error={errors.repeatPassword?.message}
				/>
			</div>
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
