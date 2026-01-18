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
	retrieveDataAboutOrganization,
} from '@/lib/server/organization-managment';
import { PieChart } from '@/modules/main/organization/manage/pie-chart';
import { BarChart } from '@/modules/main/organization/manage/bar-chart';

export default async function ManagePage({
	params,
}: {
	params: Promise<{
		organizationId: string;
	}>;
}) {
	const { organizationId } = await params;

	const [member, requests, users, organizationData] = await Promise.all([
		retrieveOrganizationMember(organizationId),
		retrieveAllRequestsToJoinOrganization(organizationId),
		retrieveAllUsersInOrganization(organizationId),
		retrieveDataAboutOrganization(organizationId),
	]);

	console.log(organizationData);

	if (
		!member.success ||
		member.organizationMember.role !== 'OWNER' ||
		!requests.success ||
		!users.success ||
		!organizationData.success
	) {
		notFound();
	}

	// Tasks
	// Taks (pie) and users (bar)

	const pieTasks = [
		{
			count: organizationData.highPriority,
			name: 'High Priority',
		},
		{ count: organizationData.mediumPriority, name: 'Medium Priority' },
		{
			count: organizationData.lowPriority,
			name: 'Low Priority',
		},
	];

	const barUser = [
		{ value: organizationData.adminUserCount, name: 'Admins' },
		{ value: organizationData.memberUserCount, name: 'Members' },
		{ value: 1, name: 'Owners' },
	];
	return (
		<>
			<div className="aspect-video max-w-80">
				<PieChart data={pieTasks} dataKey="count" />
			</div>

			<div>
				<BarChart data={barUser} xKey="name" yKey="value" />
			</div>
			<h2 className="mb-6 text-xl underline underline-offset-4 lg:text-2xl">
				Requests
			</h2>

			<RequestsForm requests={requests} />
			<h2 className="mb-6 mt-10 text-xl underline underline-offset-4 lg:text-2xl">
				Members{' '}
				<span className="italic">({organizationData.totalUserCount})</span>
			</h2>

			<CurrentUsersForm users={users} />
		</>
	);
}
