// External packages
import { notFound } from 'next/navigation';

// Modules
import { VideoMeetingRoom } from '@/modules/main/organization/video-meeting/video-meeting-room';

// Lib
import { getSession } from '@/lib/server/user';
import { getOrganizationDetailsById } from '@/lib/server/organization';
import { retrieveOrganizationMember } from '@/lib/server/organization-managment';

export default async function VideoMeetingPage({
	params,
	searchParams,
}: {
	params: Promise<{
		organizationId: string;
	}>;
	searchParams?: Promise<{ mode?: string }>;
}) {
	const { organizationId } = await params;
	const resolvedSearchParams = await searchParams;

	const initialMode =
		resolvedSearchParams?.mode === 'start' ||
		resolvedSearchParams?.mode === 'join'
			? resolvedSearchParams.mode
			: undefined;

	const [session, organizationDetailsById, member] = await Promise.all([
		getSession(),
		getOrganizationDetailsById(organizationId),
		retrieveOrganizationMember(organizationId),
	]);

	if (!session.success || !organizationDetailsById.success || !member.success) {
		notFound();
	}

	return (
		<VideoMeetingRoom
			organizationId={organizationId}
			currentUser={session}
			userRole={member.organizationMember.role}
			initialMode={initialMode}
		/>
	);
}
