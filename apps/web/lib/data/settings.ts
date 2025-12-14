// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

// Types
import { DataWithFile } from '@repo/types/upload';

// Schemas
import {
	ResetPasswordSettingsArgs,
	SettingsArgs,
} from '@repo/schemas/settings';

export async function changeProfileInfo({
	data,
	file,
}: DataWithFile<SettingsArgs>) {
	try {
		const res = await API().patch('settings/change-profile-info', data);

		if (res.data?.presignedURL && data.image && file) {
			await API({
				headers: { 'Content-type': data.image.contentType },
			}).put(res.data.presignedURL, file);
		}
		delete res.data?.presignedURL;

		return res.data;
	} catch (err) {
		catchError(err);
	}
}
export async function resetPasswordInApp(data: ResetPasswordSettingsArgs) {
	try {
		const res = await API().post('settings/reset-password-in-app', data);

		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function deleteAccount() {
	try {
		const res = await API().delete('settings/delete-account');
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
