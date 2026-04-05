'use client';

// External packages
import * as React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Accordion } from '@/components/ui/accordion';

// Types
import { RetrieveAllOrganizationLeaveFeedbacksResponse } from '@repo/types/organization-managment';

// Lib
import { convertToFullname } from '@/lib/utils/converter';

export const LeaveFeedbacks: React.FC<{
	leaveFeedbacks: RetrieveAllOrganizationLeaveFeedbacksResponse;
}> = ({ leaveFeedbacks }) => {
	return (
		<div className="border-input-border min-h-1/2 max-h-3/4 flex flex-col overflow-scroll rounded-xl border shadow-xl">
			{leaveFeedbacks.leaveFeedbacks.length > 0 ? (
				<Accordion
					type="multiple"
					items={leaveFeedbacks.leaveFeedbacks.map((feedback) => ({
						value: `item-${feedback.id}`,
						trigger: (
							<div
								className="border-input-border flex w-full items-center gap-4 border-t px-6 py-3 lg:gap-6"
								key={feedback.id}
							>
								<Link
									href={`/profile/${feedback.author.id}`}
									className="flex items-center gap-4"
								>
									<Avatar
										size="sm"
										imageProps={{
											src: feedback.author.image
												? `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${feedback.author.image}`
												: undefined,
										}}
										isVerified={feedback.author.subscriptionTier === 'PRO'}
									>
										{convertToFullname({
											firstname: feedback.author.firstName || '',
											lastname: feedback.author.lastName || '',
										})}
									</Avatar>

									<p className="text-muted-foreground text-sm underline-offset-2 hover:underline">
										{convertToFullname({
											firstname: feedback.author.firstName || '',
											lastname: feedback.author.lastName || '',
										})}
									</p>
								</Link>

								<p className="text-muted-foreground line-clamp-1 text-sm">
									{feedback.reason.substring(0, 20)}...
								</p>

								<ChevronDown className="ml-auto transition-transform duration-300 group-data-[state=closed]:rotate-0 group-data-[state=open]:rotate-180" />
							</div>
						),
						contentProps: {
							children: (
								<div className="p-4">
									<p>{feedback.reason}</p>
									{feedback.suggestions ? (
										<>
											<h4 className="mb-2 mt-4 text-sm font-semibold">
												Suggestions
											</h4>
											<p>{feedback.suggestions}</p>
										</>
									) : null}
								</div>
							),
						},
					}))}
				/>
			) : (
				<p className="text-muted-foreground my-auto p-6 text-center">
					No leave feedback found.
				</p>
			)}
		</div>
	);
};
