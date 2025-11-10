'use client';

// External packages
import { Form } from 'react-aria-components';

// Modules
import { PersonalInformationForm } from '@/modules/main/settings/personal-information-form';
import { ProfileForm } from '@/modules/main/settings/profile-form';
import { Button } from '@/components/ui/button';

export const FormWrapper = () => {
	return (
		<Form className="flex w-full flex-col">
			<ProfileForm />
			<PersonalInformationForm />
			<Button
				type="submit"
				className="ml-auto mt-10 w-full md:w-fit md:py-2"
				size="lg"
			>
				Save
			</Button>
		</Form>
	);
};
