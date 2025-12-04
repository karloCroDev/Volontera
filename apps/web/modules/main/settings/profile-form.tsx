'use client';

// External packages
import * as React from 'react';
import { Trash } from 'lucide-react';
import { Label as AriaLabel, Input as AriaInput } from 'react-aria-components';
import { Controller, useFormContext } from 'react-hook-form';

// Components
import { Button } from '@/components/ui/button';
import { FilledInput } from '@/components/ui/filled-input';
import { PasswordDialog } from '@/modules/main/settings/reset-password-dialog';
import { Label } from '@/components/ui/label';
import { Avatar } from '@/components/ui/avatar';

// Hooks
import { useSession } from '@/hooks/data/auth';

// Schemas
import { SettingsArgs } from '@repo/schemas/settings';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';

export const ProfileForm: React.FC<{
	currentImage: File | undefined;
	setCurrentImage: React.Dispatch<React.SetStateAction<File | undefined>>;
}> = withReactQueryProvider(({ currentImage, setCurrentImage }) => {
	const { data: user } = useSession();
	const {
		control,
		watch,
		formState: { errors },
	} = useFormContext<SettingsArgs>();

	return (
		<div className="border-input-border flex flex-col justify-between gap-8 rounded-md border p-6 lg:p-8 xl:flex-row 2xl:p-10">
			<div>
				<h4 className="text-lg font-semibold">Profile</h4>
				<p className="text-muted-foreground mt-2">Set your account details</p>
			</div>

			<div className="flex flex-col items-center gap-12 xl:flex-row xl:items-center">
				<div className="order-2 flex w-full flex-col gap-6 xl:-order-1 xl:w-auto">
					<div className="flex gap-4">
						<div className="flex-1">
							<Label isOptional>First name</Label>

							{user && (
								<Controller
									control={control}
									name="firstName"
									render={({ field }) => (
										<FilledInput
											placeholderValue="First name"
											label={user.firstName}
											className="mt-2"
											inputProps={field}
											error={errors.firstName?.message}
										/>
									)}
								/>
							)}
						</div>
						<div className="flex-1">
							<Label isOptional>Last name</Label>
							{user?.lastName && (
								<Controller
									control={control}
									name="lastName"
									render={({ field }) => (
										<FilledInput
											placeholderValue="Last name"
											label={user.lastName}
											className="mt-2"
											inputProps={field}
											error={errors.lastName?.message}
										/>
									)}
								/>
							)}
						</div>
					</div>
					<div>
						<Label isOptional>Password</Label>
						<PasswordDialog />
					</div>
				</div>

				<div className="relative">
					<Controller
						control={control}
						name="image"
						render={({ field: { onChange } }) => (
							<>
								<AriaLabel htmlFor="image">
									<Avatar
										imageProps={{
											src:
												(currentImage && URL.createObjectURL(currentImage)) ||
												user?.image,
											alt: 'Avatar',
										}}
										size="4xl"
										isInput
										deleteButton={
											currentImage && (
												<Button
													className="p-3"
													isFullyRounded
													colorScheme="yellow"
													onPress={() => {
														setCurrentImage(undefined);
														if (user?.image) {
															onChange({
																deleteImage: user.image,
															});
														}
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
											deleteImage: user?.image,
										});
										setCurrentImage(file);
									}}
									className="absolute cursor-pointer opacity-0"
								/>
							</>
						)}
					/>
				</div>
			</div>
		</div>
	);
});
