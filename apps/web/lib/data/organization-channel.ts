// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

// Schemas
import {
	CreateOrganizationChannelArgs,
	DeleteOrganizationChannelArgs,
	RetrieveOrganizationChannelsArgs,
	UpdateOrganizationChannelArgs,
} from '@repo/schemas/organization-channel';

export async function retrieveOrganizationChannels({
	organizationId,
}: RetrieveOrganizationChannelsArgs) {
	try {
		const res = await API().get(`/organization-channel/${organizationId}`);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function createOrganizationChannel(
	data: CreateOrganizationChannelArgs
) {
	try {
		const res = await API().post('/organization-channel', {
			organizationId: data.organizationId,
			channelName: data.channelName,
			description: data.description,
		});
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function updateOrganizationChannel({
	channelId,
	organizationId,
	channelName,
	description,
}: UpdateOrganizationChannelArgs) {
	try {
		const res = await API().patch(
			`/organization-channel/${organizationId}/${channelId}`,
			{
				...(channelName ? { channelName } : {}),
				...(description ? { description } : {}),
			}
		);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function deleteOrganizationChannel({
	channelId,
	organizationId,
}: DeleteOrganizationChannelArgs) {
	try {
		const res = await API().delete(
			`/organization-channel/${organizationId}/${channelId}`
		);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
