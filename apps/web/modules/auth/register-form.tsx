'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

// Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@/components/ui/icon';

// Hooks
import { useRegister } from '@/hooks/data/auth';

// Schemas
import { RegisterArgs, registerSchema } from '@repo/schemas/auth';

export const RegisterForm = () => {
	const { isPending, mutate } = useRegister();
	const {
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<RegisterArgs>({
		resolver: zodResolver(registerSchema),
	});

	const router = useRouter();
	const onSubmit = async (data: RegisterArgs) => {
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
			<div className="flex gap-8">
				<div className="flex-1">
					<Label htmlFor="Email">First name</Label>
					<Input
						id="firstName"
						label="Enter your first name..."
						className="mt-2"
						error={errors.firstName?.message}
					/>
				</div>
				<div className="flex-1">
					<Label htmlFor="Email">Last name</Label>
					<Input
						id="lastName"
						label="Enter your last name..."
						className="mt-2"
						error={errors.lastName?.message}
					/>
				</div>
			</div>
			<div>
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					label="Enter your email..."
					className="mt-2"
					error={errors.email?.message}
				/>
			</div>
			<div>
				<Label htmlFor="password">Password</Label>
				<Input
					id="password"
					label="Enter your password..."
					className="mt-2"
					error={errors.password?.message}
				/>
			</div>

			<Button className="w-full" size="lg" colorScheme="yellow">
				Create account
			</Button>

			<Separator />
			<Button
				className="w-full"
				size="lg"
				colorScheme="bland"
				iconLeft={<Icon name="google" className="text-background" />}
				isDisabled={isPending}
			>
				Create account with google
			</Button>
		</Form>
	);
};
