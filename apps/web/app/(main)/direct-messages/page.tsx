import { Avatar } from '@/components/ui/avatar';
import { DotWithLabel } from '@/components/ui/dot';
import { Message } from '@/components/ui/message';
import { ResizableTextArea } from '@/components/ui/resizable-input';
import { getSession } from '@/lib/server/get-session';
import { ListUsers } from '@/modules/main/direct-messages/list-users';
import { MessageForm } from '@/modules/main/direct-messages/message-form';
import { MessageWrapper } from '@/modules/main/direct-messages/message-wrapper';
import { UsersInfoHeader } from '@/modules/main/direct-messages/users-info-header';
import { UsersSearch } from '@/modules/main/direct-messages/users-search';
import { UsersSidebar } from '@/modules/main/direct-messages/users-sidebar';
import { SessionSuccessResponse } from '@repo/types/auth';

export default async function DirectMessagesPage() {
	const user = (await getSession()) as SessionSuccessResponse;

	return (
		<div className="flex h-full">
			<ListUsers />

			<MessageWrapper>
				<UsersInfoHeader />

				<div className="flex flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
					<Message
						date="16:36 | 8.4. 2024"
						avatar={
							<Avatar
								imageProps={{
									src: user.image,
								}}
							>
								{user.fullname}
							</Avatar>
						}
					>
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda,
						sit? Explicabo reprehenderit corporis fugiat cumque minus nobis?
						Esse error, omnis eum, perferendis velit assumenda recusandae
						obcaecati sint dignissimos eius molestiae?
					</Message>
					<Message
						variant="secondary"
						date="16:36 | 8.4. 2024"
						avatar={
							<Avatar
								imageProps={{
									src: '',
								}}
							>
								Cool man
							</Avatar>
						}
					>
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda,
						sit? Explicabo reprehenderit corporis fugiat cumque minus nobis?
						Esse error, omnis eum, perferendis velit assumenda recusandae
						obcaecati sint dignissimos eius molestiae?{' '}
					</Message>
					<MessageForm />
				</div>
			</MessageWrapper>
		</div>
	);
}
