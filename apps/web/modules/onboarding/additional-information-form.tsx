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
import {
	AdditionalFormArgs,
	additionalInformationSchema,
} from '@repo/schemas/onboarding';

// Config
import { withReactQueryProvider } from '@/config/react-query';
import { useAdditionalInformation } from '@/hooks/data/onboarding';
import { toast } from '@/lib/utils/toast';

export const AdditionalInformationForm = withReactQueryProvider(() => {
	const {
		control,
		handleSubmit,
		formState: { errors },
		setError,
		watch,
	} = useForm<AdditionalFormArgs>({
		resolver: zodResolver(additionalInformationSchema),
	});

	const router = useRouter();
	const hasUserInput = watch().DOB || watch().bio || watch().image;
	const [currentImage, setCurrentImage] = React.useState<File | undefined>(
		undefined
	);

	const { mutate, isPending } = useAdditionalInformation();

	const onSubmit = async (data: AdditionalFormArgs) => {
		console.log('test');
		mutate(data, {
			onSuccess({ message }) {
				router.push('/home');
				toast({
					title: 'Welcome to [app]',
					content: message,
					variant: 'success',
				});
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
										src: currentImage && URL.createObjectURL(currentImage),
										alt: 'Avatar',
									}}
									size="full"
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
									Karlo Grgic
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
								className="absolute cursor-pointer opacity-0"
							/>
						</>
					)}
				/>
			</div>

			<div className="w-full">
				<Label isOptional>DOB</Label>
				<Controller
					control={control}
					name="DOB"
					render={({ field: { onChange } }) => (
						<DatePicker
							onChange={(val) => {
								if (!val) return;
								const formatted = `${String(val.month).padStart(2, '0')}-${String(val.day).padStart(2, '0')}-${val.year}`;
								onChange(formatted);
							}}
							className="mt-2"
						/>
					)}
				/>
			</div>
			<div className="w-full">
				<Label htmlFor="bio" isOptional>
					Bio
				</Label>

				<Controller
					control={control}
					name="bio" // TODO: Handle on how am I passing the image data!
					render={({ field }) => (
						<Textarea
							id="bio"
							label="Enter your bio..."
							className="mt-2"
							{...field}
						/>
					)}
				/>
			</div>

			{errors.root && <Error>{errors.root.message}</Error>}

			<Button
				className="w-full"
				size="lg"
				iconRight={!hasUserInput && <ArrowRight />}
				colorScheme={hasUserInput ? 'orange' : 'bland'}
				type="submit"
				isLoading={isPending}
				isDisabled={isPending}
			>
				{!hasUserInput ? 'Skip' : 'Save'}
			</Button>
		</Form>
	);
});
