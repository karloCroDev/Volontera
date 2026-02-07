'use client';

// External pakcages
import * as React from 'react';
import { Checkbox } from 'react-aria-components';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Markdown from 'react-markdown';
import { useParams } from 'next/navigation';

// Components
import { Button } from '@/components/ui/button';
import { CheckboxVisually, CheckboxWithLabel } from '@/components/ui/checkbox';
import { Avatar } from '@/components/ui/avatar';
import { Accordion } from '@/components/ui/accordion';

// Hooks
import { useAcceptOrDeclineUsersRequestToJoinOrganization } from '@/hooks/data/organization-managment';

// Lib
import { toast } from '@/lib/utils/toast';
import { IRevalidateTag } from '@/lib/server/revalidation';
import { convertToFullname } from '@/lib/utils/converter';

// Types
import { RetirveAllRequestsToJoinOrganizationResponse } from '@repo/types/organization-managment';

// Schemas
import { AcceptOrDeclineUsersRequestToJoinOrganizationArgs } from '@repo/schemas/organization-managment';

export const RequestsForm: React.FC<{
	requests: RetirveAllRequestsToJoinOrganizationResponse;
}> = ({ requests }) => {
	const [ids, setIds] = React.useState<
		AcceptOrDeclineUsersRequestToJoinOrganizationArgs['requesterIds']
	>([]);

	const params = useParams<{ organizationId: string }>();

	const { mutate } = useAcceptOrDeclineUsersRequestToJoinOrganization();

	const onSubmit = (
		status: AcceptOrDeclineUsersRequestToJoinOrganizationArgs['status']
	) => {
		mutate(
			{
				requesterIds: ids,
				organizationId: params.organizationId,
				status,
			},
			{
				onSuccess({ message, title }) {
					toast({
						title,
						content: message,
						variant: 'success',
					});
					IRevalidateTag('organization-join-requests');
					IRevalidateTag('organization-members');
				},
				onError({ title, message }) {
					toast({
						title,
						content: message,
						variant: 'error',
					});
				},
			}
		);
	};

	return (
		<div className="border-input-border min-h-1/2 max-h-3/4 flex flex-col overflow-scroll rounded-xl border shadow-xl">
			<div className="border-input-border bg-muted flex items-center justify-between border-b px-6 py-4">
				<CheckboxWithLabel
					checkboxVisuallyProps={{
						size: 'lg',
					}}
					onChange={(val) => {
						return val
							? setIds(requests.requests.map((n) => n.requester.id))
							: setIds([]);
					}}
				>
					Select all
				</CheckboxWithLabel>

				{ids.length > 0 && (
					<div className="flex gap-4">
						<Button
							colorScheme="success"
							size="xs"
							isFullyRounded
							// isLoading={isPending}
							onPress={() => onSubmit('APPROVED')}
						>
							Approve
						</Button>
						<Button
							colorScheme="destructive"
							size="xs"
							isFullyRounded
							// isLoading={isPending}
							onPress={() => onSubmit('REJECTED')}
							type="submit"
						>
							Reject
						</Button>
					</div>
				)}
			</div>
			{requests.requests.length > 0 ? (
				<Accordion
					type="multiple"
					items={requests.requests.map((request) => ({
						value: `item-${request.id}`,
						trigger: (
							<div
								className="border-input-border flex w-full items-center gap-4 border-t px-6 py-3 lg:gap-6"
								key={request.id}
							>
								<Checkbox
									className="group"
									isSelected={ids.includes(request.requester.id)}
									onChange={(val) => {
										if (val) {
											setIds((prev) => [...prev, request.requester.id]);
										} else {
											setIds((prev) =>
												prev.filter((id) => id !== request.requester.id)
											);
										}
									}}
								>
									<CheckboxVisually variant="secondary" />
								</Checkbox>

								<Link
									href={`/profile/${request.requester.id}`}
									className="flex items-center gap-4"
								>
									<Avatar
										size="sm"
										imageProps={{
											src: request.requester.image
												? `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${request.requester.image}`
												: undefined,
										}}
										isVerified={request.requester.subscriptionTier === 'PRO'}
									>
										{convertToFullname({
											firstname: request.requester.firstName || '',
											lastname: request.requester.lastName || '',
										})}
									</Avatar>

									<p className="text-muted-foreground text-sm underline-offset-2 hover:underline">
										{convertToFullname({
											firstname: request.requester.firstName || '',
											lastname: request.requester.lastName || '',
										})}
									</p>
								</Link>

								<ChevronDown className="ml-auto transition-transform duration-300 group-data-[state=closed]:rotate-0 group-data-[state=open]:rotate-180" />
							</div>
						),
						contentProps: {
							children: (
								<div className="p-4">
									<h4 className="mb-4 text-lg font-semibold underline underline-offset-4">
										{request.title}
									</h4>
									<Markdown>{request.content}</Markdown>
								</div>
							),
						},
					}))}
				/>
			) : (
				<p className="text-muted-foreground my-auto text-center">
					No requests to join the organization.
				</p>
			)}
		</div>
	);
};
