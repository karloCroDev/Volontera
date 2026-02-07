'use client';

// External packages
import * as React from 'react';

import { useParams } from 'next/navigation';
// Components
import { Button } from '@/components/ui/button';

// Hooks
import { useToggleFollowOrganization } from '@/hooks/data/organization';

// Lib
import { IRevalidateTag } from '@/lib/server/revalidation';
import { toast } from '@/lib/utils/toast';

export const FollowOrganizationButton: React.FC<{
	hasUserFollowed: boolean;
}> = ({ hasUserFollowed }) => {
	const params = useParams<{ organizationId: string }>();
	const { mutate, isPending } = useToggleFollowOrganization();
	return (
		<Button
			colorScheme="yellow"
			size="md"
			onPress={() =>
				mutate(
					{
						organizationId: params.organizationId,
					},
					{
						onSuccess: ({ message, title }) => {
							toast({
								title,
								content: message,
								variant: 'success',
							});
							IRevalidateTag('organization-details');
						},
					}
				)
			}
			isLoading={isPending}
			isDisabled={isPending}
		>
			{hasUserFollowed ? 'Unfollow' : 'Follow'}
		</Button>
	);
};
