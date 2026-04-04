// External packages
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

// Modules
import { VideoMeetingRoom } from '@/modules/main/organization/video-meeting/video-meeting-room';

// Lib
import { getSession } from '@/lib/server/user';
import { getOrganizationDetailsById } from '@/lib/server/organization';
import { retrieveOrganizationMember } from '@/lib/server/organization-managment';
import { getOrganizationVideoMeetingState } from '@/lib/server/organization-video-meeting';

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
		<VideoMeetingRoom
			organizationId={organizationId}
			currentUser={session}
			userRole={member.organizationMember.role}
			dehydratedState={dehydratedState}
		/>
	);
}
