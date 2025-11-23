'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

// Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Error } from '@/components/ui/error';

// Hooks
import { useForgotPassword } from '@/hooks/data/auth';

// Schemas
import { ForgotPasswordArgs, forgotPasswordSchema } from '@repo/schemas/auth';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';

export const ForgotPasswordForm = withReactQueryProvider(() => {
	const { isPending, mutate } = useForgotPassword();
	const {
		control,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<ForgotPasswordArgs>({
		resolver: zodResolver(forgotPasswordSchema),
	});

	const onSubmit = async (data: ForgotPasswordArgs) => {
		mutate(data, {
			onSuccess({ message }) {},
			onError(err) {
				setError('root', err);
			},
		});
	};
	return (
		<Form
			className="mt-12 flex flex-col gap-8 lg:mt-16"
			onSubmit={handleSubmit(onSubmit)}
		>
			<div>
				<Label htmlFor="email">Email</Label>
				<Controller
					control={control}
					name="email"
					render={({ field }) => (
						<Input
							id="email"
							label="Enter your email..."
							className="mt-2"
							error={errors.email?.message}
							{...field}
						/>
					)}
				/>
			</div>
			{errors.root && <Error>{errors.root.message}</Error>}
			<Button
				className="w-full"
				size="lg"
				isDisabled={isPending}
				isLoading={isPending}
			>
				Send verification code
			</Button>
		</Form>
	);
});
