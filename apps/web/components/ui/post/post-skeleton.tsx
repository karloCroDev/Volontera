export const PostSkeleton = () => (
	<div className="border-input-border bg-muted animate-pulse rounded-xl border px-8 py-6">
		<div className="mb-8 flex gap-4">
			<div className="flex items-center gap-2">
				<div className="bg-muted-foreground/20 h-10 w-10 rounded-full" />
				<div className="space-y-2">
					<div className="bg-muted-foreground/20 h-4 w-32 rounded" />
					<div className="bg-muted-foreground/20 h-3 w-24 rounded" />
				</div>
			</div>
			<div className="ml-auto flex gap-2">
				<div className="bg-muted-foreground/20 h-8 w-8 rounded-md" />
			</div>
		</div>
		<div className="bg-muted-foreground/20 mb-4 h-6 w-3/4 rounded" />
		<div className="space-y-3">
			<div className="bg-muted-foreground/20 h-4 w-full rounded" />
			<div className="bg-muted-foreground/20 h-4 w-[95%] rounded" />
			<div className="bg-muted-foreground/20 h-4 w-[90%] rounded" />
		</div>
		<div className="mt-4">
			<div className="bg-muted-foreground/20 aspect-[4/3] w-full rounded-md" />
		</div>
	</div>
);
