// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

// Schemas
import { CreateOrganizationArgs } from '@repo/schemas/create-organization';

export async function createOrganization(data: CreateOrganizationArgs) {
	try {
		const res = await API().post('/organization/create-organization', data);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
