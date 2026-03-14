import { Avatar } from '@/components/ui/avatar';
import { Container } from '@/components/ui/container';
import { LinkAsButton } from '@/components/ui/link-as-button';
import { Separator } from '@/components/ui/separator';
import { Volontera } from '@/components/ui/volonotera';
import { ArrowLeft, Ban, MessageCircle } from 'lucide-react';

export default async function BannedPage() {
	return (
		<div className="flex h-screen flex-col items-center justify-center">
			<Ban className="text-destructive size-80" />

			<div className="mt-8 flex gap-4 lg:mt-10 lg:gap-6">
				<div className="max-w-3xl">
					<div className="flex justify-center gap-4">
						<h1 className="flex text-center text-4xl font-semibold">
							You have been banned from
						</h1>
						<Volontera />
					</div>
					<p className="text-muted-foreground mt-2 text-center">
						You have been violated our terms of service and have been banned
						from using Volontera. If you think this is a mistake, please contact
						our support team for more information. We are here to help you and
						resolve any issues you may have. Contact us at
						<a
							href="mailto:karlo.webdev@gmail.com"
							className="text-primary ml-2 hover:underline"
						>
							karlo.webdev@gmail.com
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
