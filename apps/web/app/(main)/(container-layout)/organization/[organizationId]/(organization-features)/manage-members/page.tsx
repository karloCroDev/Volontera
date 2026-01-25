// External packages
import { notFound } from 'next/navigation';
import { ChartArea } from 'lucide-react';

// Modules
import { CurrentUsersForm } from '@/modules/main/organization/manage-members/current-users-form';
import { RequestsForm } from '@/modules/main/organization/manage-members/requests-form';
import { PieChart } from '@/modules/main/organization/manage-members/pie-chart';
import { BarChart } from '@/modules/main/organization/manage-members/bar-chart';

// Components
import { Paywall } from '@/components/ui/paywall';

// Lib
import {
	retrieveAllRequestsToJoinOrganization,
	retrieveOrganizationMember,
	retrieveAllUsersInOrganization,
	retrieveDataAboutOrganization,
} from '@/lib/server/organization-managment';
import { RetrieveDataAboutOrganizationResponse } from '@repo/types/organization-managment';
import { Button } from '@/components/ui/button';
import { LinkAsButton } from '@/components/ui/link-as-button';

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
			<RequestsForm requests={requests} />
			<h2 className="mb-6 mt-10 text-xl underline underline-offset-4 lg:text-2xl">
				Members{' '}
				{/* <span className="italic">({organizationData.totalUserCount - 1})</span> */}
			</h2>
			<CurrentUsersForm users={users} />

			<h2 className="mb-6 mt-10 text-xl underline underline-offset-4 lg:text-2xl">
				Settings
			</h2>
			<div className="flex justify-between">
				<Button variant="outline" colorScheme="destructive">
					Delete Organization
				</Button>

				<LinkAsButton href={`/organization/${organizationId}/edit`}>
					Edit organization
				</LinkAsButton>
			</div>
			{/* TODO: Ako bude vremena stavi da se mogu uredjivati informacije od organizacije */}
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
				<TaskKPI count={organizationData.highPriority} title="High Priority" />
				<TaskKPI
					count={organizationData.mediumPriority}
					title="Medium Priority"
				/>
				<TaskKPI count={organizationData.lowPriority} title="Low Priority" />
			</div>

			<ChartContainer
				title="Tasks ratio"
				subtitle="Total tasks ration between priorities inside the organization"
			>
				<div className="mt-auto aspect-square">
					<PieChart data={pieTasks} dataKey="count" />
				</div>
			</ChartContainer>

			<ChartContainer
				title="Members"
				subtitle="Total members ratio between roles inside the organization"
			>
				<div className="mx-auto mt-auto w-3/4 flex-1 text-sm">
					<BarChart data={barUser} xKey="name" yKey="value" />
				</div>
			</ChartContainer>
		</div>
	);
};

const ChartContainer: React.FC<{
	children: React.ReactNode;
	title: string;
	subtitle: string;
}> = (
	// eslint-disable-next-line react/prop-types
	{ children, title, subtitle }
) => (
	<div className="bg-muted border-input-border flex aspect-[4/3] max-h-80 flex-1 flex-col overflow-hidden rounded-md border p-4 shadow-md">
		<h4 className="text-md">{title}</h4>
		<p className="text-muted-foreground mb-4 text-sm">{subtitle}</p>
		{children}
	</div>
);

const TaskKPI: React.FC<{
	title: string;
	count: number;
}> = (
	// eslint-disable-next-line react/prop-types
	{ title, count }
) => (
	<div className="bg-muted border-input-border min-w-80 rounded-md border p-4 shadow">
		<div className="flex justify-between">
			<p>
				{title} <span className="text-muted-foreground ml-2">(task)</span>
			</p>
			<ChartArea className="text-muted-foreground size-3" />
		</div>

		<p className="text-lg">{count}</p>
	</div>
);
