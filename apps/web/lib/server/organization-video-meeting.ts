// Lib
import { serverFetch } from '@/lib/utils/server-fetch';

// Types
import { OrganizationVideoMeetingState } from '@repo/types/organizaton-video-meeting';

export async function getOrganizationVideoMeetingState(
	organizationId: string
): Promise<OrganizationVideoMeetingState> {
	return serverFetch<OrganizationVideoMeetingState>({
		url: `organization-video-meeting/state/${organizationId}`,
		init: { cache: 'no-store' },
	});
}
