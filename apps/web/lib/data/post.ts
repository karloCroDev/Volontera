// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

//
import {
	CreatePostArgs,
	DeletePostArgs,
	UpdatePostArgs,
	RetrievePostWithCommentsArgs,
	RetrieveOrganizationPostsArgs,
} from '@repo/schemas/post';
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

export async function deletePost({ postId }: DeletePostArgs) {
	try {
		const res = await API().delete(`/post`, {
			data: { postId },
		});
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function retrieveOrganizationPosts({
	organizationId,
}: RetrieveOrganizationPostsArgs) {
	try {
		const res = await API().get('/post', {
			params: { organizationId },
		});
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
export async function retrievePostWithComments({
	postId,
}: RetrievePostWithCommentsArgs) {
	try {
		const res = await API().get(`/post/id/${postId}`);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
