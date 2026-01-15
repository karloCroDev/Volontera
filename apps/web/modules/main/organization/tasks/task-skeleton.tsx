export const TasksBoardSkeleton = () => (
	<div className="border-input-border bg-muted sm:min-w-2/3 lg:min-w-1/2 2xl:min-w-2/5 flex min-h-[600px] min-w-full flex-1 flex-col gap-5 rounded-xl border p-4">
		<div className="flex items-center justify-between">
			<div className="bg-muted-foreground/20 h-6 w-40 animate-pulse rounded-md" />
			<div className="bg-muted-foreground/20 h-8 w-8 animate-pulse rounded-md" />
		</div>
		<div className="no-scrollbar flex flex-1 flex-col gap-4">
			{[...Array(3)].map((_, indx) => (
				<TaskCardSkeleton key={indx} />
			))}
		</div>
		<div className="bg-muted-foreground/20 h-10 w-40 animate-pulse rounded-lg" />
	</div>
);

const TaskCardSkeleton = () => (
	<div className="border-input-border flex flex-col gap-2 rounded-lg border p-3">
		<div className="bg-muted-foreground/20 h-4 w-1/2 animate-pulse rounded" />
		<div className="bg-muted-foreground/20 h-3 w-full animate-pulse rounded" />
		<div className="bg-muted-foreground/20 h-3 w-3/4 animate-pulse rounded" />
	</div>
);
