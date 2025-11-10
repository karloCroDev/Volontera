'use client';

// External packages
import * as React from 'react';
import {
	Form,
	Label as AriaLabel,
	Input as AriaInput,
} from 'react-aria-components';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

// Components
import { Button } from '@/components/ui/button';

// Hooks
import { useSession } from '@/hooks/data/auth';

// Schemas
import {
	SettingsProfileArgs,
	settingsProfileSchema,
} from '@repo/schemas/settings';
import { Avatar } from '@/components/ui/avatar';
import { ArrowRight, Trash } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { Error } from '@/components/ui/error';

// Config
import { withReactQueryProvider } from '@/config/react-query';
import { getTextFieldBasicStyles, Input } from '@/components/ui/input';
import { twJoin } from 'tailwind-merge';

export const ProfileForm = withReactQueryProvider(() => {
	const {
		control,
		handleSubmit,
		formState: { errors },
		setError,
		watch,
	} = useForm<SettingsProfileArgs>({
		resolver: zodResolver(settingsProfileSchema),
	});

	const router = useRouter();

	const [currentImage, setCurrentImage] = React.useState<File | undefined>(
		undefined
	);

	const { data: user } = useSession();

	const onSubmit = () => {};
	return (
		<Form className="border-input-border flex flex-col justify-between gap-8 rounded-md border p-6 lg:p-8 xl:flex-row 2xl:p-10">
			<div>
				<h4 className="text-lg font-semibold">Profile</h4>
				<p className="text-muted-foreground mt-2">Set your account details</p>
			</div>

			<div className="flex flex-col items-center gap-12 xl:flex-row xl:items-end">
				<div className="order-2 flex flex-col gap-6 xl:-order-1">
					<div className="flex gap-4">
						<div className="flex-1">
							<Label isOptional>First name</Label>
							<Controller
								control={control}
								name="firstName"
								render={({ field }) => (
									<Input
										label="First name"
										className="mt-2"
										inputProps={field}
									/>
								)}
							/>
						</div>
						<div className="flex-1">
							<Label isOptional>Last name</Label>
							<Controller
								control={control}
								name="lastName"
								render={({ field }) => (
									<Input
										label="Last name"
										className="mt-2"
										inputProps={field}
									/>
								)}
							/>
						</div>
					</div>
					<div>
						<Label isOptional>Password</Label>
						<Button
							variant="blank"
							className={twJoin(
								getTextFieldBasicStyles,
								'text-muted-foreground mt-2 flex items-center justify-between px-4'
							)}
						>
							Change your password
						</Button>
					</div>
				</div>

				<div className="relative flex flex-col">
					<Controller
						control={control}
						name="image"
						render={({ field: { onChange } }) => (
							<>
								<AriaLabel htmlFor="image">
									<Avatar
										imageProps={{
											src: currentImage && URL.createObjectURL(currentImage),
											alt: 'Avatar',
										}}
										size="4xl"
										isInput
										deleteButton={
											watch().image && (
												<Button
													className="p-3"
													isFullyRounded
													colorScheme="yellow"
													onPress={() => {
														setCurrentImage(undefined);
														onChange();
													}}
												>
													<Trash className="size-4" />
												</Button>
											)
										}
									>
										{user?.fullname}
									</Avatar>
								</AriaLabel>

								<AriaInput
									id="image"
									type="file"
									accept="image/*"
									onChange={(e) => {
										const file = e.target?.files?.[0];

										if (!file) return;

										onChange({
											filename: file.name,
											contentType: file.type,
											size: file.size,
										});
										setCurrentImage(file);
									}}
									className="absolute cursor-pointer opacity-0"
								/>
							</>
						)}
					/>
					<Button
						className="order-3 ml-auto mt-8 hidden py-2 xl:block"
						size="lg"
						type="submit"
						colorScheme="bland"
					>
						Save
					</Button>
				</div>
				<Button
					className="order-3 ml-auto py-2 xl:hidden"
					size="lg"
					type="submit"
				>
					Save
				</Button>
			</div>
		</Form>
	);
});
