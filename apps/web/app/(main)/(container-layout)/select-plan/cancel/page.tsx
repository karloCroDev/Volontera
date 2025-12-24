// External packages
import { ArrowLeft } from 'lucide-react';
import { BookmarkX } from 'lucide-react';

// Components
import { LinkAsButton } from '@/components/ui/link-as-button';

export default function SuccessPlanPage() {
	return (
		<div className="flex h-full flex-col items-center justify-center">
			<BookmarkX className="text-destructive size-80" />
			<h1 className="mt-4 text-center text-2xl font-semibold">
				You cancelled process of buying a PRO plan!
			</h1>
			<p className="text-muted-foreground mt-2 text-center">
				You have cancelled the process of buying a plan. No changes were made to
				your account (and bank account).
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
