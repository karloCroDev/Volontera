// Config
import { API } from '@/config/axios-client';

// Lib
import { catchError } from '@/lib/utils/error';

// Repo
import { AdditionalFormArgs } from '@repo/schemas/onboarding';
import { AppType } from '@repo/types/onbaording';

export async function appType(data: AppType) {
	try {
		const res = await API().post('onboarding/app-type', data);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
export async function additionalInformation(data: AdditionalFormArgs) {
	try {
		const res = await API().post('onboarding/additional-information', data);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
