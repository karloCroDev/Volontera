// Types
import { DataWithFiles } from '@repo/types/upload';

// Schemas
import { MessageArgs } from '@repo/schemas/direct-messages';
import { PresignImagesSchemaArgs } from '@repo/schemas/image';

// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

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
