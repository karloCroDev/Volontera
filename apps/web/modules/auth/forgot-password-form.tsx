'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

// Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Hooks
import { useForgotPassword } from '@/hooks/data/auth';

// Schemas
import { ForgotPasswordArgs, forgotPasswordSchema } from '@repo/schemas/auth';

export const ForgotPasswordForm = () => {
	const { isPending, mutate } = useForgotPassword();
	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<ForgotPasswordArgs>({
		resolver: zodResolver(forgotPasswordSchema),
	});

	const router = useRouter();
	const onSubmit = async (data: ForgotPasswordArgs) => {
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
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					label="Enter your email..."
					className="mt-2"
					error={errors.email?.message}
				/>
			</div>
			<Button className="w-full" size="lg" isDisabled={isPending}>
				Send verification code
			</Button>
		</Form>
	);
};
