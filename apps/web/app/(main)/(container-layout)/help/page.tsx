// Components
import { Avatar } from '@/components/ui/avatar';
import { Heading } from '@/components/ui/heading';
import { Message } from '@/components/ui/message';

// Lib
import { getSession } from '@/lib/server/get-session';

// Modules
import { HelpMessageForm } from '@/modules/main/help/help-message-form';

// Types
import { SessionSuccessResponse } from '@repo/types/auth';

export default async function HelpPage() {
	// Layout already handles the session
	const user = (await getSession()) as SessionSuccessResponse;

	return (
		<>
			<Heading subtitle="Ask our automated AI assistant to help you navigate our website">
				Help
			</Heading>

			<div className="flex flex-1 flex-col">
				<div className="flex flex-1 flex-col gap-4">
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
						date="16:36 | 8.4. 2024"
						variant="secondary"
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
						obcaecati sint dignissimos eius molestiae?
					</Message>
				</div>

				<HelpMessageForm />
			</div>
		</>
	);
}
