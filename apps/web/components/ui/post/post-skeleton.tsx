import { Container } from '@/components/ui/container';
import { Skeleton } from '@/components/ui/skeleton';

export const PostSkeleton = () => (
	<Container className="rounded-xl px-8 py-6 shadow-none">
		<div className="mb-8 flex gap-4">
			<div className="flex items-center gap-2">
				<Skeleton className="bg-muted-foreground/20 h-10 w-10 rounded-full" />
				<div className="space-y-2">
					<Skeleton className="bg-muted-foreground/20 h-4 w-32" />
					<Skeleton className="bg-muted-foreground/20 h-3 w-24" />
				</div>
			</div>
			<div className="ml-auto flex gap-2">
				<Skeleton className="bg-muted-foreground/20 h-8 w-8 rounded-md" />
			</div>
		</div>
		<Skeleton className="bg-muted-foreground/20 mb-4 h-6 w-3/4" />
		<div className="space-y-3">
			<Skeleton className="bg-muted-foreground/20 h-4 w-full" />
			<Skeleton className="bg-muted-foreground/20 h-4 w-[95%]" />
			<Skeleton className="bg-muted-foreground/20 h-4 w-[90%]" />
		</div>
		<div className="mt-4">
			<Skeleton className="bg-muted-foreground/20 aspect-[4/3] w-full rounded-md" />
		</div>
	</Container>
);
