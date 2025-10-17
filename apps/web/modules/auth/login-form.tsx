'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

// Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@/components/ui/icon';
import { Error } from '@/components/ui/error';

// Hooks
import { useLogin } from '@/hooks/data/auth';

// Schemas
import { LoginArgs, loginSchema } from '@repo/schemas/auth';

// Config
import { withReactQueryProvider } from '@/config/react-query';

export const LoginForm = withReactQueryProvider(() => {
	const { isPending, mutate } = useLogin();
	const {
		control,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<LoginArgs>({
		resolver: zodResolver(loginSchema),
	});

	const router = useRouter();
	const onSubmit = async (data: LoginArgs) => {
		mutate(data, {
			onSuccess({ message, success }) {
				if (!success) {
					return setError('root', {
						message,
					});
				}

				router.push('/login/verify-otp');
			},
		});
	};
	return (
		<Form
			className="mt-12 flex flex-col gap-8 lg:mt-16"
			onSubmit={handleSubmit(onSubmit)}
		>
			<div>
				<Label htmlFor="Email">Email</Label>
				<Controller
					control={control}
					name="email"
					render={({ field }) => (
						<Input
							id="Email"
							label="Enter your email..."
							className="mt-2"
							error={errors.email?.message}
							{...field}
						/>
					)}
				/>
			</div>
			<div>
				<div className="flex items-baseline justify-between">
					<Label htmlFor="password">Password</Label>
					<Link
						href="/auth/login/forgot-password"
						className="hover:text-popover text-muted-foreground underline underline-offset-4 transition-colors"
					>
						Forgot Passowrd?
					</Link>
				</div>

				<Controller
					control={control}
					name="password"
					render={({ field }) => (
						<Input
							id="password"
							label="Enter your password..."
							className="mt-2"
							error={errors.password?.message}
							{...field}
						/>
					)}
				/>
			</div>
			{errors.root && <Error>{errors.root.message}</Error>}

			<Button className="w-full" size="lg" colorScheme="yellow">
				Login
			</Button>

			<Separator />
			<Button
				className="w-full"
				size="lg"
				colorScheme="bland"
				iconLeft={<Icon name="google" className="text-background" />}
				disabled={isPending}
			>
				Login with google
			</Button>
		</Form>
	);
});
