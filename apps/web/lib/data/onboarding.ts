// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

// Types
import { DataWithFile } from '@repo/types/upload';
import {
	AdditionalFormArgs,
	AppTypeSchemaArgs,
} from '@repo/schemas/onboarding';

export async function appType(data: AppTypeSchemaArgs) {
	try {
		const res = await API().post('onboarding/app-type', data);
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
