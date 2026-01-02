// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

// Getting the user
export async function clientSession() {
	try {
		const res = await API().get('user/session');
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function getUserById(userId: string) {
	try {
		const res = await API().get(`user/${userId}`);
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
