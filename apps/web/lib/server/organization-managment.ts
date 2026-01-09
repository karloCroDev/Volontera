// Lib
import { serverFetch } from '@/lib/utils/server-fetch';

// Types
import { ServerHandleResponse } from '@repo/types/general';
import {
	RetirveAllRequestsToJoinOrganizationResponse,
	RetrieveAllMembersInOrganizationResponse,
	RetrieveOrganizationMemberResponse,
} from '@repo/types/organization-managment';

export async function retrieveOrganizationMember(
	organizationId: string
): Promise<RetrieveOrganizationMemberResponse | ServerHandleResponse<false>> {
	return await serverFetch({
		url: `organization-managment/member/${organizationId}`,
		init: { next: { tags: ['organization-users'] }, cache: 'no-store' },
	});
}

export async function retrieveAllUsersInOrganization(
	organizationId: string
): Promise<
	RetrieveAllMembersInOrganizationResponse | ServerHandleResponse<false>
> {
	return await serverFetch({
		url: `organization-managment/users/${organizationId}`,
		init: { next: { tags: ['organization-members'] }, cache: 'no-store' },
	});
}

export async function retrieveAllRequestsToJoinOrganization(
	organizationId: string
): Promise<
	RetirveAllRequestsToJoinOrganizationResponse | ServerHandleResponse<false>
> {
	return await serverFetch({
		url: `organization-managment/requests/${organizationId}`,
		init: { next: { tags: ['organization-join-requests'] }, cache: 'no-store' },
	});
}
