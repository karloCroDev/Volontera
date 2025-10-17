// Modules
import { AdditionalInformationForm } from '@/modules/onboarding/additional-information-form';

export default async function AdditionalInformation() {
	return (
		<div>
			<h1 className="text-2xl">Additional information</h1>
			<p className="text-muted-foreground">
				Add more information about yourself (optional). Don&apos;t worry you can
				change this later in the settings!
			</p>
			<AdditionalInformationForm />
		</div>
	);
}
