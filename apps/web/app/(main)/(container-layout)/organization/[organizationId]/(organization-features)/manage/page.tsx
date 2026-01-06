// External packages

import { CurrentUsersForm } from '@/modules/main/organization/manage/current-users-form';
import { RequestsForm } from '@/modules/main/organization/manage/requests-form';

export default async function ManagePage() {
	return (
		<>
			<h2 className="mb-6 text-xl underline underline-offset-4 lg:text-2xl">
				Requests
			</h2>

			<RequestsForm />

			<h2 className="mb-6 mt-10 text-xl underline underline-offset-4 lg:text-2xl">
				Current users (26)
			</h2>

			<CurrentUsersForm />
		</>
	);
}
