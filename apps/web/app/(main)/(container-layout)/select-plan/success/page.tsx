// External packages
import { ArrowLeft, CloudCheck } from 'lucide-react';

// Components
import { LinkAsButton } from '@/components/ui/link-as-button';

export default function SuccessPlanPage() {
	return (
		<div className="flex h-full flex-col items-center justify-center">
			<CloudCheck className="text-success size-80" />
			<h1 className="mt-4 text-center text-2xl font-semibold">
				PRO Plan successfully activated!
			</h1>
			<p className="text-muted-foreground mt-2 text-center">
				Your plan is now active and ready to use. Enjoy the benefits!
			</p>

			<LinkAsButton
				href="/home"
				className="mt-6 lg:mt-8"
				iconLeft={<ArrowLeft />}
			>
				Go back home
			</LinkAsButton>
		</div>
	);
}
