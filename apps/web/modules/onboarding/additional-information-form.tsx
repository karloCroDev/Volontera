'use client';

// External packages
import * as React from 'react';
import { Form, Input, Label as AriaLabel } from 'react-aria-components';
import { ArrowRight, Trash } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Error } from '@/components/ui/error';

// Schemas
import { SettingsArgs } from '@repo/schemas/settings';

// Hooks
import { useSession } from '@/hooks/data/user';
import {
	useAdditionalInformation,
	useSkipAdditionalInformation,
} from '@/hooks/data/onboarding';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { toast } from '@/lib/utils/toast';
import {
	convertCalendarDate,
	convertToFullname,
	convertToPascalCase,
} from '@/lib/utils/converter';

// Schemas
import {
	AdditionalFormArgs,
	additionalInformationSchema,
} from '@repo/schemas/onboarding';

export const AdditionalInformationForm = withReactQueryProvider(() => {
	// Same handling as settings form with addition of skip functionality
	const {
		control,
		handleSubmit,
		formState: { errors, isDirty },
		setError,
	} = useForm<AdditionalFormArgs>({
		resolver: zodResolver(additionalInformationSchema),
		defaultValues: {
			bio: '',
			DOB: '',
			image: undefined,
		},
	});

	const router = useRouter();

	const [currentImage, setCurrentImage] = React.useState<File | undefined>(
		undefined
	);

	const { data: user } = useSession();
	const { mutate, isPending } = useAdditionalInformation();
	const { mutate: skipAdditionalInformation } = useSkipAdditionalInformation();

	console.log(isDirty);
	const onSubmit = async (data: SettingsArgs) => {
		const hasUserInput = data.DOB || data.bio || data.image;

		if (!hasUserInput) {
			return skipAdditionalInformation(undefined, {
				onSuccess({ title, message }) {
					router.push('/home');
					toast({
						title,
						content: message,
						variant: 'success',
					});
				},
				onError(err) {
					setError('root', err);
				},
			});
		}

		mutate(
			{ data, file: currentImage },
			{
				onSuccess({ message }) {
					router.push('/home');
					toast({
						title: 'Welcome to [app]',
						content: message,
						variant: 'success',
					});
				},
				onError(err) {
					setError('root', err);
				},
			}
		);
	};

	return (
		<Form
			className="mt-20 flex flex-col items-center gap-6 lg:gap-8"
			onSubmit={handleSubmit(onSubmit)}
		>
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
											user?.image ||
											'',
										alt: 'Avatar',
									}}
									size="full"
									isInput
									deleteButton={
										currentImage && (
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
									{user &&
										convertToFullname({
											firstname: user.firstName,
											lastname: user.lastName,
										})}
								</Avatar>
							</AriaLabel>

							<Input
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
								className="sr-only"
							/>
						</>
					)}
				/>
			</div>
			{errors.image?.message && (
				<Error className="mt-2">{errors.image.message}</Error>
			)}

			<div className="w-full">
				<Label isOptional className="mb-2">
					DOB
				</Label>
				<Controller
					control={control}
					name="DOB"
					render={({ field: { onChange } }) => (
						<DatePicker
							onChange={(val) => {
								if (!val) return;

								const formatted = convertCalendarDate(val);
								onChange(formatted);
							}}
						/>
					)}
				/>

				{errors.DOB?.message && (
					<Error className="mt-2">{errors.DOB.message}</Error>
				)}
			</div>
			<div className="w-full">
				<Label htmlFor="bio" isOptional className="mb-2">
					Bio
				</Label>

				<Controller
					control={control}
					name="bio"
					render={({ field }) => (
						<Textarea
							id="bio"
							label="Enter your bio..."
							textAreaProps={{
								...field,
							}}
							error={errors.bio?.message}
						/>
					)}
				/>
			</div>

			{errors.root && <Error>{errors.root.message}</Error>}

			<Button
				className="w-full"
				size="lg"
				iconRight={!isDirty && <ArrowRight />}
				colorScheme={isDirty ? 'orange' : 'bland'}
				type="submit"
				isLoading={isPending}
				isDisabled={isPending}
			>
				{!isDirty ? 'Skip' : 'Save'}
			</Button>
		</Form>
	);
});
