// External packages
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

// Modules
import { VideoMeetingRoom } from '@/modules/main/organization/video-meeting/video-meeting-room';
import { VideoMeetingRoomContextProvider } from '@/modules/main/organization/video-meeting/video-meeting-room-context';

// Lib
import { getSession } from '@/lib/server/user';
import { getOrganizationDetailsById } from '@/lib/server/organization';
import { retrieveOrganizationMember } from '@/lib/server/organization-managment';
import { getOrganizationVideoMeetingState } from '@/lib/server/organization-video-meeting';
import { ReactQueryProvider } from '@/lib/utils/react-query';

export default async function VideoMeetingPage({
	params,
}: {
	params: Promise<{
		organizationId: string;
	}>;
}) {
	const { organizationId } = await params;
	const queryClient = new QueryClient();

	const [session, organizationDetailsById, member] = await Promise.all([
		getSession(),
		getOrganizationDetailsById(organizationId),
		retrieveOrganizationMember(organizationId),
		queryClient.prefetchQuery({
			queryKey: ['organization-video-meeting', organizationId],
			queryFn: () => getOrganizationVideoMeetingState(organizationId),
		}),
	]);

	if (!session.success || !organizationDetailsById.success || !member.success) {
		notFound();
	}

	const dehydratedState = dehydrate(queryClient);

	return (
		<ReactQueryProvider dehydratedState={dehydratedState}>
			<VideoMeetingRoomContextProvider
				organizationId={organizationId}
				currentUser={session}
				userRole={member.organizationMember.role}
			>
				<VideoMeetingRoom
					currentUser={session}
					userRole={member.organizationMember.role}
				/>
			</VideoMeetingRoomContextProvider>
		</ReactQueryProvider>
	);
}
