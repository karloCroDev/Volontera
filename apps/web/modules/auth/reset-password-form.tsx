'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';

// Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Error } from '@/components/ui/error';

// Hooks
import { useResetPassword } from '@/hooks/data/auth';

// Schemas
import { ResetPasswordArgs, resetPasswordSchema } from '@repo/schemas/auth';

// Lib
import { toast } from '@/lib/utils/toast';
import { withReactQueryProvider } from '@/lib/utils/react-query';

export const ResetPasswordForm = withReactQueryProvider(() => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const { isPending, mutate } = useResetPassword();
	const {
		control,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<ResetPasswordArgs>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: '',
			repeatPassword: '',
			token: searchParams.get('token') || '',
		},
	});

	const onSubmit = async (data: ResetPasswordArgs) => {
		mutate(data, {
			onSuccess({ message, title }) {
				toast({
					title,
					content: message,
					variant: 'success',
				});
				router.push('/auth/login');
			},
			onError({ message }) {
				setError('root', {
					message,
				});
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
							inputProps={{
								...field,
								type: 'password',
							}}
							error={errors.password?.message}
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
							inputProps={{
								...field,
								type: 'password',
							}}
							className="mt-2"
							error={errors.repeatPassword?.message}
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
				isLoading={isPending}
				type="submit"
			>
				Reset password
			</Button>
		</Form>
	);
});
