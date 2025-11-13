'use client';

// External packages
import { Form } from 'react-aria-components';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { parseDate } from '@internationalized/date';

// Components
import { Button } from '@/components/ui/button';

// Modules
import { PersonalInformationForm } from '@/modules/main/settings/personal-information-form';
import { ProfileForm } from '@/modules/main/settings/profile-form';

// Hooks
import { useSession } from '@/hooks/data/auth';

// Config
import { withReactQueryProvider } from '@/config/react-query';

// Schemas
import { settingsSchema, SettingsSchemaArgs } from '@repo/schemas/settings';

export const FormWrapper = withReactQueryProvider(() => {
	const { data: user } = useSession();

	const methods = useForm<SettingsSchemaArgs>({
		resolver: zodResolver(settingsSchema),

		defaultValues: {
			firstName: user?.firstName,
			lastName: user?.lastName,
			bio: user?.bio ?? '',
			workOrSchool: user?.workOrSchool ?? '',
			DOB: user?.DOB ?? '',
		},
	});

	const watchAll = methods.watch();
	const hasAnyValue = !!(
		watchAll.firstName ||
		watchAll.lastName ||
		watchAll.image ||
		watchAll.DOB ||
		watchAll.bio ||
		watchAll.workOrSchool
	);

	console.log(hasAnyValue);
	return (
		<FormProvider {...methods}>
			<Form className="flex w-full flex-col">
				<ProfileForm />
				<PersonalInformationForm />
				<Button
					type="submit"
					className="ml-auto mt-10 w-full md:w-fit"
					size="md"
					isDisabled={!hasAnyValue}
				>
					Save
				</Button>
			</Form>
		</FormProvider>
	);
});
