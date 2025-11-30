// Lib
import { ChangeProfileArgs } from '@/hooks/data/settings';
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

// Schemas
import {
	ResetPasswordSettingsArgs,
	SettingsArgs,
} from '@repo/schemas/settings';
import { ErrorFormResponse, SuccessfulResponse } from '@repo/types/general';

export async function changeProfileInfo({ data, file }: ChangeProfileArgs) {
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
