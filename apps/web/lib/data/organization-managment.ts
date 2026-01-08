// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

// Schemas
import {
	AcceptOrDeclineUsersRequestToJoinOrganizationArgs,
	DemoteOrPromoteOrganizationMemberArgs,
	RetirveAllRequestsToJoinOrganizationArgs,
	RetrieveAllUsersInOrganizationArgs,
	RetrieveOrganizationMemberArgs,
} from '@repo/schemas/organization-managment';

export async function retrieveAllRequestsToJoinOrganization({
	organizationId,
}: RetirveAllRequestsToJoinOrganizationArgs) {
	try {
		const res = await API().get(
			`/organization-managment/requests/${organizationId}`
		);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function retrieveAllUsersInOrganization({
	organizationId,
}: RetrieveAllUsersInOrganizationArgs) {
	try {
		const res = await API().get(
			`/organization-managment/users/${organizationId}`
		);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function acceptOrDeclineUsersRequestToJoinOrganization(
	data: AcceptOrDeclineUsersRequestToJoinOrganizationArgs
) {
	try {
		const res = await API().post(
			'/organization-managment/accept-decline-request',
			data
		);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function demoteOrPromoteOrganizationMember(
	data: DemoteOrPromoteOrganizationMemberArgs
) {
	try {
		const res = await API().post(
			'/organization-managment/demote-promote-member',
			data
		);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

// Everyone
export async function retrieveOrganizationMember({
	organizationId,
}: RetrieveOrganizationMemberArgs) {
	try {
		const res = await API().get(
			`/organization-managment/member/${organizationId}`
		);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
