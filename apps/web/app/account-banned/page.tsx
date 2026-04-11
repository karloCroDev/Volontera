// External packages
import { Ban } from 'lucide-react';
import { redirect } from 'next/navigation';

// Components
import { Volontera } from '@/components/ui/volonotera';

// Lib
import { getSession } from '@/lib/server/user';

export default async function BannedPage() {
	const user = await getSession();

	if (!user.success && !user.isBanned) redirect('/auth/login');
	if (!user.isBanned) redirect('/home');

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
