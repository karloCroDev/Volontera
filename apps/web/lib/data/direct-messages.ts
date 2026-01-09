// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

// Schemas
import {
	SearchArgs,
	ConversationArgs,
	MessageArgs,
} from '@repo/schemas/direct-messages';
import { PresignImagesSchemaArgs } from '@repo/schemas/image';

// Types
import { DataWithFiles } from '@repo/types/upload';

export async function getListOfAllDirectMessages() {
	try {
		const res = await API().get('direct-messages');
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function searchAllUsers({ query }: SearchArgs) {
	try {
		const res = await API().get(`direct-messages/search/${query}`);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function getDirectMessagesConversationById({
	conversationId,
}: ConversationArgs) {
	try {
		const res = await API().get(`direct-messages/${conversationId}`);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function startConversationOrStartAndSendDirectMessage({
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
		const res = await API().post('direct-messages/conversation/message', {
			content: data.content,
			particpantId: data.particpantId,
			...(imageKeys && imageKeys.length ? { imageKeys } : {}),
		});
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
