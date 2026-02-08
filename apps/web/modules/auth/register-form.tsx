'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

// Components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@/components/ui/icon';
import { Error } from '@/components/ui/error';

// Hooks
import { useRegister } from '@/hooks/data/auth';

// Schemas
import { RegisterArgs, registerSchema } from '@repo/schemas/auth';
import { withReactQueryProvider } from '@/lib/utils/react-query';

// Lib
import { toast } from '@/lib/utils/toast';
import { AnchorAsButton } from '@/components/ui/anchor-as-button';

export const RegisterForm = withReactQueryProvider(() => {
	const { isPending, mutate } = useRegister();
	const {
		control,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<RegisterArgs>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
		},
	});

	const router = useRouter();
	const onSubmit = async (data: RegisterArgs) => {
		mutate(data, {
			onSuccess({ title, message }) {
				toast({
					title,
					content: message,
					variant: 'success',
				});
				router.push(`/auth/login/verify-otp?email=${data.email}`);
			},

			onError(err) {
				setError('root', err);
				console.error(err);
			},
		});
	};

	return (
		<>
			<Form
				className="mt-12 flex flex-col gap-8 lg:mt-16"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="flex gap-8">
					<div className="flex-1">
						<Label htmlFor="Email">First name</Label>
						<Controller
							control={control}
							name="firstName"
							render={({ field }) => (
								<Input
									inputProps={field}
									id="firstName"
									label="Enter your first name..."
									className="mt-2"
									error={errors.firstName?.message}
								/>
							)}
						/>
					</div>
					<div className="flex-1">
						<Label htmlFor="lastName">Last name</Label>
						<Controller
							control={control}
							name="lastName"
							render={({ field }) => (
								<Input
									inputProps={field}
									id="lastName"
									label="Enter your last name..."
									className="mt-2"
									error={errors.lastName?.message}
								/>
							)}
						/>
					</div>
				</div>
				<div>
					<Label htmlFor="email">Email</Label>
					<Controller
						control={control}
						name="email"
						render={({ field }) => (
							<Input
								inputProps={field}
								id="email"
								label="Enter your email..."
								className="mt-2"
								error={errors.email?.message}
							/>
						)}
					/>
				</div>
				<div>
					<Label htmlFor="password">Password</Label>
					<Controller
						control={control}
						name="password"
						render={({ field }) => (
							<Input
								id="password"
								inputProps={{
									...field,
									type: 'password',
								}}
								label="Enter your password..."
								className="mt-2"
								error={errors.password?.message}
							/>
						)}
					/>
				</div>
				{errors.root && <Error>{errors.root.message}</Error>}
				<Button
					className="w-full"
					size="lg"
					colorScheme="yellow"
					isDisabled={isPending}
					isLoading={isPending}
					type="submit"
				>
					Create account
				</Button>
				<Separator />
				<AnchorAsButton
					className="w-full"
					size="lg"
					colorScheme="bland"
					href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
					iconLeft={<Icon name="google" className="text-background" />}
				>
					Create account with google
				</AnchorAsButton>
			</Form>
		</>
	);
});
