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
import { useSession } from '@/hooks/data/auth';

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
			firstName: user?.firstName ?? '', // Getting the values 100%, however hook form needs to accept the values that are string and not undefined
			lastName: user?.lastName ?? '', // Getting the values 100%, however hook form needs to accept the values that are string and not undefined,
			bio: user?.bio ?? '',
			workOrSchool: user?.workOrSchool ?? '',
			DOB: user?.DOB ?? '',
		},
	});

	// Reset the form when user data arrives so defaultValues are applied after async load
	React.useEffect(() => {
		if (!user) return;
		methods.reset({
			firstName: user.firstName ?? '',
			lastName: user.lastName ?? '',
			bio: user.bio ?? '',
			workOrSchool: user.workOrSchool ?? '',
			DOB: user.DOB ?? '',
		});
	}, [user]);

	const canSubmit = methods.formState.isDirty;

	const { mutate, isPending } = useChangeProfileInfo();

	const onSubmit = (data: SettingsArgs) => {
		mutate(data, {
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
				methods.setError('root', err);
			},
		});
	};

	return (
		<FormProvider {...methods}>
			<Form
				className="flex w-full flex-col"
				onSubmit={methods.handleSubmit(onSubmit)}
			>
				<ProfileForm />
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
