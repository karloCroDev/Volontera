'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

// Components
import { Button } from '@/components/ui/button';

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
		resolver: zodResolver(settingsSchema),

		defaultValues: {
			firstName: '',
			lastName: '',
			address: '',
			bio: '',
			workOrSchool: '',
			DOB: '',
		},
	});

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
		});
	}, [user]);

	const canSubmit = methods.formState.isDirty;

	const { mutate, isPending } = useChangeProfileInfo();

	const [currentImage, setCurrentImage] = React.useState<File | undefined>(
		undefined
	);
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

					IRevalidateTag('session');
					methods.reset();
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
