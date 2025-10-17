// External packages
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Modules
import { AdditionalInformationForm } from '@/modules/onboarding/additional-information-form';

export default async function AdditionalInformation() {
	return (
		<div>
			<div className="flex items-baseline gap-6 lg:gap-8">
				<Link href="/onboarding/app-type">
					<ArrowLeft />
				</Link>
				<div>
					<h1 className="text-2xl">Additional information</h1>
					<p className="text-muted-foreground">
						Add more information about yourself (optional). Don&apos;t worry you
						can change this later in the settings!
					</p>
				</div>
			</div>
			<AdditionalInformationForm />
		</div>
	);
}
