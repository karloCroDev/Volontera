// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

//
import {
	CreatePostArgs,
	DeletePostArgs,
	UpdatePostArgs,
	RetrievePostArgs,
	RetrieveOrganizationPostsArgs,
	LikeOrDislikePostArgs,
} from '@repo/schemas/post';
import { DataWithFiles } from '@repo/types/upload';

export async function createPost({
	data,
	files,
}: Required<DataWithFiles<CreatePostArgs>>) {
	try {
		const res = await API().post('/post', data);

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
		const res = await API().get(`/post/${organizationId}`);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function retrievePostWithComments({ postId }: RetrievePostArgs) {
	try {
		const res = await API().get(`/post/id/${postId}`);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function likePost({ postId }: LikeOrDislikePostArgs) {
	try {
		const res = await API().patch('/post/like', { postId });
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
export async function dislikePost({ postId }: LikeOrDislikePostArgs) {
	try {
		const res = await API().patch('/post/dislike', { postId });
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function updatePost({
	data,
	files,
}: DataWithFiles<UpdatePostArgs>) {
	try {
		const res = await API().patch('/post', data);

		console.log(files);
		if (files && files.length > 0 && res.data?.presignedUrls) {
			console.log('Uploading files...');
			await Promise.all(
				data.images.map((image, index) => {
					if (typeof image !== 'string') {
						return API({
							headers: { 'Content-type': image.contentType },
						}).put(res.data.presignedUrls[index], files[index]);
					}
				})
			);
		}
		delete res.data?.presignedUrls;
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function retrievePostData({ postId }: RetrievePostArgs) {
	try {
		const res = await API().get(`/post/data/${postId}`);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
