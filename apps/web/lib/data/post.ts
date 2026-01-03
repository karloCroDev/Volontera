// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

//
import { CreatePostArgs } from '@repo/schemas/post';
import { DataWithFiles } from '@repo/types/upload';

export async function createPost({
	data,
	files,
}: Required<DataWithFiles<CreatePostArgs>>) {
	try {
		const res = await API().post('/post', { ...data, ...files });

		await Promise.all(
			data.images.map((image, index) =>
				API({
					headers: { 'Content-type': image.contentType },
				}).put(res.data.presignedUrls[index], files[index])
			)
		);
		delete res.data?.presignedUrls;
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
