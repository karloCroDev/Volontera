// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

// Repo
import { DataWithFile } from '@repo/types/upload';
import { AppType } from '@repo/types/onboarding';
import { AdditionalFormArgs } from '@repo/schemas/onboarding';

export async function appType(data: AppType) {
	try {
		const res = await API({
			headers: {
				'Content-Type': 'text/plain',
			},
		}).post('onboarding/app-type', data);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
export async function additionalInformation({
	data,
	file,
}: DataWithFile<AdditionalFormArgs>) {
	try {
		const res = await API().post('onboarding/additional-information', data);

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
export async function skipAdditionalInformation() {
	try {
		const res = await API().post('onboarding/skip-additional-information');
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
