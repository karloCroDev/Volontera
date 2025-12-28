// External packages
import { redirect } from 'next/navigation';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Message } from '@/components/ui/message';

// Lib
import { getSession } from '@/lib/server/auth';

// Modules
import { MessageForm } from '@/modules/main/direct-messages/message-form';
import { convertToFullname } from '@/lib/utils/convert-to-fullname';

export default async function GroupChatPage() {
	const user = await getSession();

	if (!user.success) redirect('/auth/login');
	return (
		<>
			<div className="flex min-h-[800px] flex-1 flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
				<div className="no-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto">
					<Message
						date="16:36 | 8.4. 2024"
						avatar={
							<Avatar
								imageProps={{
									src: user?.image || '',
								}}
							>
								{convertToFullname({
									firstname: user.firstName,
									lastname: user.lastName,
								})}
							</Avatar>
						}
					>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea, rem,
						tenetur quaerat dolore nobis totam voluptas itaque sunt placeat unde
						assumenda aliquid consequatur delectus eius cum autem ab facilis
						quis.
					</Message>

					<Message
						variant="secondary"
						date="16:36 | 8.4. 2024"
						avatar={<Avatar imageProps={{ src: '' }}>Cool man</Avatar>}
					>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea, rem,
						tenetur quaerat dolore nobis totam voluptas itaque sunt placeat unde
						assumenda aliquid consequatur delectus eius cum autem ab facilis
						quis.
					</Message>
					<Message
						variant="secondary"
						date="16:36 | 8.4. 2024"
						avatar={<Avatar imageProps={{ src: '' }}>Cool man</Avatar>}
					>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea, rem,
						tenetur quaerat dolore nobis totam voluptas itaque sunt placeat unde
						assumenda aliquid consequatur delectus eius cum autem ab facilis
						quis.
					</Message>
					<Message
						variant="secondary"
						date="16:36 | 8.4. 2024"
						avatar={<Avatar imageProps={{ src: '' }}>Cool man</Avatar>}
					>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea, rem,
						tenetur quaerat dolore nobis totam voluptas itaque sunt placeat unde
						assumenda aliquid consequatur delectus eius cum autem ab facilis
						quis.
					</Message>
					<Message
						variant="secondary"
						date="16:36 | 8.4. 2024"
						avatar={<Avatar imageProps={{ src: '' }}>Cool man</Avatar>}
					>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea, rem,
						tenetur quaerat dolore nobis totam voluptas itaque sunt placeat unde
						assumenda aliquid consequatur delectus eius cum autem ab facilis
						quis.
					</Message>
					<Message
						variant="secondary"
						date="16:36 | 8.4. 2024"
						avatar={<Avatar imageProps={{ src: '' }}>Cool man</Avatar>}
					>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea, rem,
						tenetur quaerat dolore nobis totam voluptas itaque sunt placeat unde
						assumenda aliquid consequatur delectus eius cum autem ab facilis
						quis.
					</Message>
					<Message
						variant="secondary"
						date="16:36 | 8.4. 2024"
						avatar={<Avatar imageProps={{ src: '' }}>Cool man</Avatar>}
					>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea, rem,
						tenetur quaerat dolore nobis totam voluptas itaque sunt placeat unde
						assumenda aliquid consequatur delectus eius cum autem ab facilis
						quis.
					</Message>
					<Message
						variant="secondary"
						date="16:36 | 8.4. 2024"
						avatar={<Avatar imageProps={{ src: '' }}>Cool man</Avatar>}
					>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea, rem,
						tenetur quaerat dolore nobis totam voluptas itaque sunt placeat unde
						assumenda aliquid consequatur delectus eius cum autem ab facilis
						quis.
					</Message>
				</div>

				<MessageForm />
			</div>
		</>
	);
}
