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

// Hooks
import { useSession } from '@/hooks/data/user';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { toast } from '@/lib/utils/toast';
import { IRevalidateTag } from '@/lib/server/revalidation';

// Hooks
import { useChangeProfileInfo } from '@/hooks/data/settings';

// Schemas
import { settingsSchema, SettingsArgs } from '@repo/schemas/settings';

export const FormWrapper = withReactQueryProvider(() => {
	const { data: user } = useSession();

	const methods = useForm<SettingsArgs>({
		// @ts-ignore
		resolver: zodResolver(settingsSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			address: '',
			bio: '',
			workOrSchool: '',
			DOB: '',
			image: undefined,
		},
	});

	// TODO: Ovo handleaj tako da prebacis korisnika sa servera
	// Pošto ovi podatci ne dolaze odmah, nego se fetchaju asinhrono, treba ih postaviti kad stignu
	React.useEffect(() => {
		if (!user) return;
		methods.reset({
			firstName: user.firstName ?? '',
			lastName: user.lastName ?? '',
			bio: user.bio ?? '',
			workOrSchool: user.workOrSchool ?? '',
			address: user.address ?? '',
			DOB: user.DOB ?? '',
			image: undefined,
		});
	}, [user, methods]);

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
						message: message || 'Request failed',
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
});
