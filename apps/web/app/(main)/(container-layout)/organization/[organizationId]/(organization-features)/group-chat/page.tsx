// External packages
import { notFound } from 'next/navigation';

// Lib
import { retreiveAllrganizationGroupChatMessages } from '@/lib/server/organization-group-chat';
import { GroupChatMapping } from '@/modules/main/organization/group-chat/group-chat-mapping';
import { AddMessageForm } from '@/modules/main/organization/group-chat/add-message-form';
import { SocketRoomContext } from '@/modules/main/organization/group-chat/socker-room-context';

export default async function GroupChatPage({
	params,
}: {
	params: Promise<{ organizationId: string }>;
}) {
	const { organizationId } = await params;

	const groupChat =
		await retreiveAllrganizationGroupChatMessages(organizationId);

	if (!groupChat.success) notFound();
	return (
		<SocketRoomContext>
			<div className="flex min-h-[800px] flex-1 flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
				<GroupChatMapping groupChat={groupChat} />
				<AddMessageForm groupChatId={groupChat.organizationGroupChat.id} />
			</div>
		</SocketRoomContext>
	);
}
