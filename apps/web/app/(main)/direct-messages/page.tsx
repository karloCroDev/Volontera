import { Avatar } from '@/components/ui/avatar';
import { DotWithLabel } from '@/components/ui/dot';
import { ResizableTextArea } from '@/components/ui/resizable-input';
import { MessageForm } from '@/modules/main/direct-messages/message-form';
import { UsersSearch } from '@/modules/main/direct-messages/users-search';
import { UsersSidebar } from '@/modules/main/direct-messages/users-sidebar';

export default async function DirectMessagesPage() {
	return (
		<div className="flex h-full">
			<aside className="border-input-border flex h-full w-1/4 flex-col border-r px-4 py-6 lg:px-6">
				<h4 className="mb-4 text-lg underline underline-offset-4 lg:text-xl">
					Your DM&apos;s
				</h4>
				<UsersSearch />

				<div className="no-scrollbar flex-1 overflow-scroll">
					{[...Array(8)].map((_, indx) => (
						<UsersSidebar
							username="Karlo"
							userRole="Organizator"
							id={indx.toString()}
							key={indx}
						/>
					))}
				</div>
			</aside>

			<div className="flex w-full flex-col">
				<div className="border-input-border flex h-fit items-center gap-4 border-b px-4 pb-4 pt-6 sm:px-6 lg:px-8">
					<Avatar
						imageProps={{
							src: '',
						}}
						size="xl"
					>
						Karlo
					</Avatar>

					<div>
						<h4 className="text-lg lg:text-xl">Karlo Grgic</h4>
						<p className="text-muted-foreground">
							Last online: 19:03 22.11.2025
						</p>
					</div>
					<DotWithLabel
						className="ml-auto"
						label="Online"
						dotProps={{ state: 'success', size: 'md' }}
					/>
				</div>

				<div className="flex flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
					Hello world
					<MessageForm />
				</div>
			</div>
		</div>
	);
}
