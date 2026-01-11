'use client';

// External packages
import { useParams } from 'next/navigation';
import * as React from 'react';

// Modules
import { useSocketContext } from '@/modules/main/direct-messages/socket-context';

export const SocketRoomContext: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const params = useParams<{ organizationId: string }>();
	const { socketGlobal } = useSocketContext();

	React.useEffect(() => {
		if (!socketGlobal) return;
		if (!params?.organizationId) return;

		socketGlobal.emit('organization-group-chat-room', params.organizationId);

		return () => {
			socketGlobal.emit(
				'organization-group-chat-room:leave',
				params.organizationId
			);
		};
	}, [params?.organizationId, socketGlobal]);

	return children;
};
