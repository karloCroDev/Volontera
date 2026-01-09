// External packages
import { notFound } from 'next/navigation';

// Modules
import { CurrentUsersForm } from '@/modules/main/organization/manage/current-users-form';
import { RequestsForm } from '@/modules/main/organization/manage/requests-form';

// Lib
import {
	retrieveAllRequestsToJoinOrganization,
	retrieveOrganizationMember,
	retrieveAllUsersInOrganization,
} from '@/lib/server/organization-managment';

export default async function ManagePage({
	params,
}: {
	params: Promise<{
		organizationId: string;
	}>;
}) {
	const { organizationId } = await params;

	const [member, requests, users] = await Promise.all([
		retrieveOrganizationMember(organizationId),
		retrieveAllRequestsToJoinOrganization(organizationId),
		retrieveAllUsersInOrganization(organizationId),
	]);

	if (
		!member.success ||
		member.organizationMember.role !== 'OWNER' ||
		!requests.success ||
		!users.success
	) {
		notFound();
	}
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
