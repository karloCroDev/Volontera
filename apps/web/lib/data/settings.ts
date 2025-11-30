// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

// Schemas
import {
	ResetPasswordSettingsArgs,
	SettingsArgs,
} from '@repo/schemas/settings';

export async function changeProfileInfo(data: SettingsArgs) {
	try {
		const res = await API().patch('settings/change-profile-info', data);
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
