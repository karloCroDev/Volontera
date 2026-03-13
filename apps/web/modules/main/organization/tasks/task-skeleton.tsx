import { Container } from '@/components/ui/container';
import { Skeleton } from '@/components/ui/skeleton';

export const TasksBoardSkeleton = () => (
	<Container className="sm:min-w-2/3 lg:min-w-1/2 2xl:min-w-2/5 flex min-h-[600px] min-w-full flex-1 flex-col gap-5 rounded-xl p-4 shadow-none">
		<div className="flex items-center justify-between">
			<Skeleton className="bg-muted-foreground/20 h-6 w-40 rounded-md" />
			<Skeleton className="bg-muted-foreground/20 h-8 w-8 rounded-md" />
		</div>
		<div className="no-scrollbar flex flex-1 flex-col gap-4">
			{[...Array(3)].map((_, indx) => (
				<TaskCardSkeleton key={indx} />
			))}
		</div>
		<Skeleton className="bg-muted-foreground/20 h-10 w-40 rounded-lg" />
	</Container>
);

const TaskCardSkeleton = () => (
	<div className="border-input-border flex flex-col gap-2 rounded-lg border p-3">
		<Skeleton className="bg-muted-foreground/20 h-4 w-1/2" />
		<Skeleton className="bg-muted-foreground/20 h-3 w-full" />
		<Skeleton className="bg-muted-foreground/20 h-3 w-3/4" />
	</div>
);
