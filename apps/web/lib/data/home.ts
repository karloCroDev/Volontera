// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

// Schemas / Types
import {
	RetrieveAlgoPostsSchema,
	RetrieveFollowedAlgoPostsSchema,
} from '@repo/schemas/home';
import { RetrieveHomePostsResponse } from '@repo/types/home';

export async function retrieveRecentAlgoHomePosts({
	limit = 10,
	offset = 0,
}: RetrieveAlgoPostsSchema) {
	try {
		const res = await API().get(`/home/home-posts`, {
			params: { limit, offset },
		});
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function retrieveRecentFollowedHomePosts({
	limit = 10,
	offset = 0,
}: RetrieveFollowedAlgoPostsSchema) {
	try {
		const res = await API().get(`/home/following`, {
			params: { limit, offset },
		});
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
