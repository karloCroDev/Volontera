// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';
import { UserSchemaArgs } from '@repo/schemas/user';

// Getting the user
export async function clientSession() {
	try {
		const res = await API().get('user/session');
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function getUserById({ userId }: UserSchemaArgs) {
	try {
		const res = await API().get(`user/id/${userId}`);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function retrieveAllOrganizationsForUser({
	userId,
}: UserSchemaArgs) {
	try {
		const res = await API().get(`user/organizations/${userId}`);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function retrieveAllPostsForUser({ userId }: UserSchemaArgs) {
	try {
		const res = await API().get(`user/posts/${userId}`);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function logout() {
	try {
		const res = await API().post('user/logout');
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
