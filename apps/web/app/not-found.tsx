// External packages
import { ArrowLeft, SearchAlert } from 'lucide-react';

// Components
import { LinkAsButton } from '@/components/ui/link-as-button';

export default async function NotFoundPage() {
	return (
		<div className="flex h-screen flex-col items-center justify-center">
			<SearchAlert className="text-destructive size-80" />
			<h1 className="mt-4 text-center text-4xl font-semibold">
				404 - Page Not Found
			</h1>
			<p className="text-muted-foreground mt-2 text-center">
				The page you are looking for does not exist. Please check the if you
				have the correct URL.
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
