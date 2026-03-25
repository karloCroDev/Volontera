// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';
import { UpdateOrganizationArgs } from '@repo/schemas/organization';

// Schemas
import {
	AcceptOrDeclineUsersRequestToJoinOrganizationArgs,
	DeleteOrganizationArgs,
	DemoteOrPromoteOrganizationMemberArgs,
	RetirveAllRequestsToJoinOrganizationArgs,
	RetrieveAllMembersInOrganizationArgs,
	RetrieveOrganizationMemberArgs,
} from '@repo/schemas/organization-managment';
import { DataWithFiles } from '@repo/types/upload';

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
}: RetrieveAllMembersInOrganizationArgs) {
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

export async function leaveOrganization({
	organizationId,
}: RetrieveOrganizationMemberArgs) {
	try {
		const res = await API().delete(
			`/organization-managment/leave/${organizationId}`
		);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function updateOrganization({
	data,
	files,
}: DataWithFiles<UpdateOrganizationArgs>) {
	try {
		const res = await API().patch(
			'/organization-managment/update-organization',
			data
		);
		let fileIndex = 0;
		const avatarFile = data.organization_avatar_image
			? files?.[fileIndex++]
			: undefined;
		const coverFile = data.organization_cover_image
			? files?.[fileIndex]
			: undefined;

		if (res.data?.imageAvatar && data.organization_avatar_image && avatarFile) {
			await API({
				headers: {
					'Content-type': data.organization_avatar_image.contentType,
				},
			}).put(res.data.imageAvatar, avatarFile);
		}

		if (res.data?.imageCover && data.organization_cover_image && coverFile) {
			await API({
				headers: {
					'Content-type': data.organization_cover_image.contentType,
				},
			}).put(res.data.imageCover, coverFile);
		}

		delete res.data?.imageAvatar;
		delete res.data?.imageCover;

		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function deleteOrganization({
	organizationId,
}: DeleteOrganizationArgs) {
	try {
		const res = await API().delete(
			`/organization-managment/delete/${organizationId}`
		);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
