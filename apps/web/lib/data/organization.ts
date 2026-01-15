// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

// Schemas
import {
	CreateOrganizationArgs,
	ToggleFollowOrganizationArgs,
	SendRequestToJoinOrganizationArgs,
} from '@repo/schemas/organization';
import { DataWithFiles } from '@repo/types/upload';

export async function createOrganization({
	data,
	files,
}: DataWithFiles<CreateOrganizationArgs>) {
	try {
		const res = await API().post('/organization/create-organization', data);

		if (res.data?.imageAvatar && data.organization_avatar_image && files) {
			await API({
				headers: { 'Content-type': data.organization_avatar_image.contentType },
			}).put(res.data.imageAvatar, files[0]); // Uvijek orderam slike u istom redosljedu na frontu
		}
		if (res.data?.imageCover && data.organization_cover_image && files) {
			await API({
				headers: { 'Content-type': data.organization_cover_image.contentType },
			}).put(res.data.imageCover, files[1]);
		}

		delete res.data?.imageAvatar;
		delete res.data?.imageCover;

		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function listOrganizationsUser() {
	try {
		const res = await API().get('/organization/list-organizations-user');
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function listOrganizationsOrganizator() {
	try {
		const res = await API().get('/organization/list-organizations-organizator');
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function sendRequestToJoinOrganization(
	data: SendRequestToJoinOrganizationArgs
) {
	try {
		const res = await API().post(
			'/organization/send-request-to-join-organization',
			data
		);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function toggleFollowOrganization({
	organizationId,
}: ToggleFollowOrganizationArgs) {
	try {
		const res = await API().post(
			`/organization/toggle-follow/${organizationId}`
		);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
