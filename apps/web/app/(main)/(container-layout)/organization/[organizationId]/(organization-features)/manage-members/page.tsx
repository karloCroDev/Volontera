// External packages
import { notFound } from 'next/navigation';
import { dehydrate, QueryClient } from '@tanstack/react-query';

// Modules
import { CurrentMembers } from '@/modules/main/organization/manage-members/current-members';
import { RequestsForm } from '@/modules/main/organization/manage-members/requests-form';
import { LeaveFeedbacks } from '@/modules/main/organization/manage-members/leave-feedbacks';
import { PieChart } from '@/components/ui/charts/pie-chart';
import { BarChart } from '@/components/ui/charts/bar-chart';
import { IndicatorKPI } from '@/components/ui/charts/indicator-kpi';
import { DeleteOrganizationDialog } from '@/modules/main/organization/manage-members/delete-organization-dialog';

// Components
import { Paywall } from '@/components/ui/paywall';
import { LinkAsButton } from '@/components/ui/link-as-button';

// Lib
import {
	retrieveAllRequestsToJoinOrganization,
	retrieveOrganizationMember,
	retrieveAllUsersInOrganization,
	retrieveDataAboutOrganization,
	retrieveAllOrganizationLeaveFeedbacks,
} from '@/lib/server/organization-managment';

// Types
import { RetrieveDataAboutOrganizationResponse } from '@repo/types/organization-managment';

// Permissions
import { hasWantedOrganizationRole } from '@repo/permissons/index';
import { GraphCardTemplate } from '@/modules/main/dashboard/graph-card-template';

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

	if (
		!hasWantedOrganizationRole({
			userRole: member.success ? member.organizationMember.role : undefined,
			requiredRoles: ['OWNER'],
		}) ||
		!requests.success ||
		!users.success
	) {
		notFound();
	}

	const leaveFeedbacks = organizationData.success
		? await retrieveAllOrganizationLeaveFeedbacks(organizationId)
		: null;

	if (
		organizationData.success &&
		(!leaveFeedbacks || !leaveFeedbacks.success)
	) {
		notFound();
	}

	const queryClient = new QueryClient();
	queryClient.setQueryData(
		['organization-join-requests', organizationId],
		requests
	);
	queryClient.setQueryData(['organization-users', organizationId], users);
	const dehydratedState = dehydrate(queryClient);

	return (
		<>
			<h2 className="mb-6 text-xl underline underline-offset-4 lg:text-2xl">
				Dashboard
			</h2>
			{organizationData.success ? (
				<Dashboard organizationData={organizationData} />
			) : (
				<Paywall />
			)}

			<h2 className="mb-6 text-xl underline underline-offset-4 lg:text-2xl">
				Requests
			</h2>
			<RequestsForm
				dehydratedState={dehydratedState}
				organizationId={organizationId}
			/>
			<h2 className="mb-6 mt-10 text-xl underline underline-offset-4 lg:text-2xl">
				Members{' '}
				{/* <span className="italic">({organizationData.totalUserCount - 1})</span> */}
			</h2>
			<CurrentMembers
				dehydratedState={dehydratedState}
				organizationId={organizationId}
			/>

			<h2 className="mb-6 mt-10 text-xl underline underline-offset-4 lg:text-2xl">
				Leave feedbacks
			</h2>
			{organizationData.success && leaveFeedbacks?.success ? (
				<LeaveFeedbacks leaveFeedbacks={leaveFeedbacks} />
			) : (
				<Paywall />
			)}

			<h2 className="mb-6 mt-10 text-xl underline underline-offset-4 lg:text-2xl">
				Settings
			</h2>
			<div className="flex justify-between">
				<DeleteOrganizationDialog organizationId={organizationId} />

				<LinkAsButton
					href={`/organization/${organizationId}/edit-organization`}
				>
					Edit organization
				</LinkAsButton>
			</div>
		</>
	);
}

const Dashboard = ({
	organizationData,
}: {
	organizationData: RetrieveDataAboutOrganizationResponse;
}) => {
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
		{ value: 1, name: 'Owners' },
		{ value: organizationData.adminUserCount, name: 'Admins' },
		{ value: organizationData.memberUserCount, name: 'Members' },
	];
	return (
		<div className="mb-6 flex flex-col gap-8 lg:flex-row">
			<div className="no-scrollbar flex gap-4 overflow-x-scroll lg:flex-col">
				<IndicatorKPI
					count={organizationData.highPriority}
					title="High Priority"
					specific="tasks"
				/>
				<IndicatorKPI
					count={organizationData.mediumPriority}
					title="Medium Priority"
					specific="tasks"
				/>
				<IndicatorKPI
					count={organizationData.lowPriority}
					title="Low Priority"
					specific="tasks"
				/>
			</div>

			<GraphCardTemplate
				title="Tasks ratio"
				subtitle="Total tasks ration between priorities inside the organization"
			>
				<div className="mx-auto mt-auto w-3/4 flex-1 text-sm">
					<PieChart data={pieTasks} dataKey="count" />
				</div>
			</GraphCardTemplate>

			<GraphCardTemplate
				title="Members"
				subtitle="Total members ratio between roles inside the organization"
			>
				<div className="mx-auto mt-auto w-3/4 flex-1 text-sm">
					<BarChart data={barUser} xKey="name" yKey="value" />
				</div>
			</GraphCardTemplate>
		</div>
	);
};
