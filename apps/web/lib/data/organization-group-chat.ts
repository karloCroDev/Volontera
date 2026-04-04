// Types
import { DataWithFiles } from '@repo/types/upload';

// Schemas
import { PresignImagesSchemaArgs } from '@repo/schemas/image';
import {
	DeleteOrganizationChannelMessageArgs,
	OrganizationChannelMessageArgs,
	RetrieveAllOrganizationChannelMessagesArgs,
} from '@repo/schemas/organization-channel-messages';

// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

export async function createGroupChatMessage({
	data,
	files,
}: DataWithFiles<OrganizationChannelMessageArgs>) {
	try {
		let imageKeys: string[] | undefined;

		// Dobivam presigned URL-ove i keyve slika, te uploadam slike
		if (data.images && data.images.length && files && files.length) {
			const presignRes = await API().post('image/presign-images', {
				images: data.images,
			} as PresignImagesSchemaArgs);

			// Uploadam slike
			if (presignRes.data?.images) {
				await Promise.all(
					presignRes.data.images.map(
						async (img: { key: string; url: string }, index: number) =>
							await API({
								headers: { 'Content-type': data.images![index]!.contentType },
							}).put(img.url, files[index])
					)
				);
				imageKeys = presignRes.data.images.map(
					(img: { key: string }) => img.key
				);
			}
		}

		// Onda posaljem poruku s keyevima slika (posto su websocketi moram na ovaj nacin handleati upload slika)
		const res = await API().post('organization-channel-messages', {
			content: data.content,
			groupChatId: data.groupChatId,
			organizationId: data.organizationId,
			...(data.parentMessageId
				? { parentMessageId: data.parentMessageId }
				: {}),
			...(imageKeys && imageKeys.length ? { imageKeys } : {}),
		});
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function retrieveAllOrganizationGroupChatMessages({
	organizationId,
}: RetrieveAllOrganizationChannelMessagesArgs) {
	try {
		const res = await API().get(
			`organization-channel-messages/${organizationId}`
		);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function deleteOrganizationGroupChatMessage({
	messageId,
	organizationId,
}: DeleteOrganizationChannelMessageArgs) {
	try {
		const res = await API().delete(
			`organization-channel-messages/${organizationId}/${messageId}`
		);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
