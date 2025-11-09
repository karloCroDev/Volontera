// Components
import { Avatar } from '@/components/ui/avatar';
import { Heading } from '@/components/ui/heading';
import { Message } from '@/components/ui/message';
import { ResizableTextArea } from '@/components/ui/resizable-input';
import { Textarea } from '@/components/ui/textarea';

// Lib

// Config
import { serverFetch } from '@/config/server-fetch';

// Types
import { SessionSuccessResponse } from '@repo/types/auth';

export default async function HelpPage() {
	const user: SessionSuccessResponse = await serverFetch({
		url: 'auth/session',
		init: {
			cache: 'no-store',
			next: { tags: ['session'] },
		},
	});

	return (
		<>
			<Heading subtitle="Ask our automated AI assistant to help you navigate our website">
				Help
			</Heading>

			<div className="flex flex-col">
				<div className="flex flex-1 flex-col gap-4">
					<Message
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

				<div className="mt-auto">
					<ResizableTextArea label="Enter your question for AI" />
				</div>
			</div>
		</>
	);
}
