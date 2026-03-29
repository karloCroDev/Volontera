import { Skeleton } from '@/components/ui/skeleton';

export const UsersInfoSkelton = () => (
	<div className="border-input-border flex w-full justify-between border-t px-4 py-3">
		<div className="flex min-w-0 items-center gap-4">
			<Skeleton className="h-8 w-8 rounded-full" />

			<div className="flex flex-col gap-2">
				<Skeleton className="h-3 w-32" />
				<Skeleton className="h-3 w-48" />
			</div>
		</div>

		<div className="flex items-center gap-8">
			<Skeleton className="h-3 w-20" />
			<Skeleton className="h-6 w-12 rounded-full" />
		</div>
	</div>
);
