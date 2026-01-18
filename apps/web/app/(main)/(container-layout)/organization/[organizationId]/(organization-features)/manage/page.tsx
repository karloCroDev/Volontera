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
import { ChartArea } from 'lucide-react';

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
		{ value: 1, name: 'Owners' },
		{ value: organizationData.adminUserCount, name: 'Admins' },
		{ value: organizationData.memberUserCount, name: 'Members' },
	];
	return (
		<>
			<h2 className="mb-6 text-xl underline underline-offset-4 lg:text-2xl">
				Dashboard (pro)
			</h2>
			<div className="mb-6 flex flex-col gap-8 lg:flex-row">
				<div className="no-scrollbar flex gap-4 overflow-x-scroll lg:flex-col">
					<TaskKPI
						count={organizationData.highPriority}
						title="High Priority"
					/>
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
			<h2 className="mb-6 text-xl underline underline-offset-4 lg:text-2xl">
				Requests
			</h2>
			<RequestsForm requests={requests} />
			<h2 className="mb-6 mt-10 text-xl underline underline-offset-4 lg:text-2xl">
				Members{' '}
				<span className="italic">({organizationData.totalUserCount - 1})</span>
			</h2>
			<CurrentUsersForm users={users} />
		</>
	);
}

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
