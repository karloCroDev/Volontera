// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

// Schemas
import { ImageKeysSchemaArgs } from '@repo/schemas/image';

export async function getImageFromKey(data: ImageKeysSchemaArgs) {
	try {
		const res = await API().post('image/get-url-from-keys', data);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
