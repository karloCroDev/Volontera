// Components
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dot } from '@/components/ui/dot';
import { Ellipsis, Plus } from 'lucide-react';

export default async function BoardPage() {
	return (
		<>
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h4 className="text-xl lg:text-2xl">Tasks</h4>
					<p className="text-muted-foreground">
						All tasks that are assigned inside this organization
					</p>
				</div>
				<Button
					colorScheme="yellow"
					variant="outline"
					isFullyRounded
					iconRight={<Plus />}
				>
					Add Board
				</Button>
			</div>
			<div className="flex min-h-0 flex-1 gap-4 overflow-y-scroll">
				<div className="border-input-border bg-muted flex flex-1 flex-col gap-5 rounded-xl border p-4">
					<div className="flex items-center justify-between">
						<h4 className="text-lg underline underline-offset-4">
							Clean the beach
						</h4>
						<Button variant="blank">
							<Ellipsis className="text-muted-foreground" />
						</Button>
					</div>

					<div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-scroll">
						<div className="border-input-border rounded-2xl border p-4">
							<div className="flex items-center gap-4">
								<Dot state="success" />
								<p className="text-md">Save the earth</p>
							</div>

							<div className="mt-3 flex items-center justify-between">
								<p className="text-muted-foreground">Jan 22 | including you</p>

								{/* Add different background colors */}

								<div className="relative">
									<Avatar
										size="sm"
										imageProps={{
											src: '',
										}}
										colorScheme="yellow"
									>
										Orrr
									</Avatar>
									<Avatar
										size="sm"
										imageProps={{
											src: '',
										}}
										colorScheme="gray"
										className="absolute -left-4 top-0"
									>
										Orrr
									</Avatar>
									<Avatar
										size="sm"
										imageProps={{
											src: '',
										}}
										colorScheme="orange"
										className="absolute -left-8 top-0 !bg-blue-400"
									>
										Orrr
									</Avatar>
								</div>
							</div>
						</div>
					</div>

					<Button isFullyRounded variant="outline" iconRight={<Plus />}>
						Add Card
					</Button>
				</div>

				<div className="border-input-border bg-muted flex-1 rounded-xl border p-4">
					<h4 className="text-lg">Clean the beach</h4>
				</div>
			</div>
		</>
	);
}
