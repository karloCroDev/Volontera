// Types
import { DataWithFiles } from '@repo/types/upload';

// Schemas
import { MessageArgs } from '@repo/schemas/direct-messages';
import { PresignImagesSchemaArgs } from '@repo/schemas/image';
import {
	DeleteOrganizationGroupChatMessageArgs,
	RetrieveAllOrganizationGroupChatMessagesArgs,
} from '@repo/schemas/organization-group-chat';

// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

export async function createGroupChatMessage({
	data,
	files,
}: DataWithFiles<MessageArgs>) {
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
		const res = await API().post('organization-group-chat/create-message', {
			content: data.content,
			particpantId: data.particpantId,
			...(imageKeys && imageKeys.length ? { imageKeys } : {}),
		});
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function retrieveAllOrganizationGroupChatMessages({
	organizationId,
}: RetrieveAllOrganizationGroupChatMessagesArgs) {
	try {
		const res = await API().get(`organization-group-chat/${organizationId}`);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function deleteOrganizationGroupChatMessage({
	messageId,
}: DeleteOrganizationGroupChatMessageArgs) {
	try {
		const res = await API().delete(
			`organization-group-chat/delete-message/${messageId}`
		);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
