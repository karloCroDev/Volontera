'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

// Components
import { Button } from '@/components/ui/button';
import { Error } from '@/components/ui/error';

// Modules
import { PersonalInformationForm } from '@/modules/main/settings/personal-information-form';
import { ProfileForm } from '@/modules/main/settings/profile-form';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { toast } from '@/lib/utils/toast';
import { IRevalidateTag } from '@/lib/server/revalidation';

// Hooks
import { useChangeProfileInfo } from '@/hooks/data/settings';

// Schemas
import { settingsSchema, SettingsArgs } from '@repo/schemas/settings';
import { UserResponse } from '@repo/types/user';

export const FormWrapper = withReactQueryProvider(
	({ user }: { user: UserResponse }) => {
		const methods = useForm<SettingsArgs>({
			resolver: zodResolver(settingsSchema),
			defaultValues: {
				firstName: user.firstName,
				lastName: user.lastName,
				address: user.address || '',
				bio: user.bio || '',
				workOrSchool: user.workOrSchool || '',
				DOB: user.DOB || '',
				image: undefined,
			},
		});

		const [currentImage, setCurrentImage] = React.useState<File | undefined>(
			undefined
		);

		const imageValue = methods.watch('image');
		const canSubmit =
			methods.formState.isDirty ||
			Boolean(currentImage) ||
			Boolean(
				imageValue && 'deleteImage' in imageValue && imageValue.deleteImage
			);

		const { mutate, isPending } = useChangeProfileInfo();

		const onSubmit = (data: SettingsArgs) => {
			mutate(
				{ data, file: currentImage },
				{
					onSuccess({ title, message }) {
						toast({
							title,
							content: message,
							variant: 'success',
						});

						// Za sve što je možda prikazano na serveru a nije u client componenti (kako bi sačuvali SSR prednosti onda ovako samo duplo checkiram)
						IRevalidateTag('session');
						setCurrentImage(undefined);
						methods.reset(methods.getValues());
					},
					onError(err) {
						const message =
							err instanceof Error
								? err.message
								: typeof err === 'object' && err && 'message' in err
									? String((err as { message?: unknown }).message ?? '')
									: 'Request failed';

						methods.setError('root', {
							type: 'server',
							message: message,
						});
					},
				}
			);
		};

		return (
			<FormProvider {...methods}>
				<Form
					className="flex w-full flex-col"
					onSubmit={methods.handleSubmit(onSubmit)}
				>
					<ProfileForm
						currentImage={currentImage}
						setCurrentImage={setCurrentImage}
					/>
					<PersonalInformationForm />
					{methods.formState.errors.root?.message && (
						<Error className="mt-4">
							{methods.formState.errors.root.message}
						</Error>
					)}
					<Button
						type="submit"
						className="ml-auto mt-10 w-full md:w-fit"
						size="md"
						// disable until the form is dirty (use changes the input)
						isDisabled={!canSubmit}
						isLoading={isPending}
					>
						Save
					</Button>
				</Form>
			</FormProvider>
		);
	}
);
