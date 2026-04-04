'use client';

// External packages
import * as React from 'react';
import { useParams } from 'next/navigation';

// Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

// Hooks
import { useDeleteOrganizationChannel } from '@/hooks/data/organization-channel';
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { toast } from '@/lib/utils/toast';

export const DeleteChannelDialog: React.FC<{
	channelId: string;
	channelName: string;
}> = withReactQueryProvider(({ channelId, channelName }) => {
	const params = useParams<{ organizationId: string }>();
	const { mutate } = useDeleteOrganizationChannel();

	const [isOpen, setIsOpen] = React.useState(false);
	return (
		<Dialog
			onOpenChange={setIsOpen}
			isOpen={isOpen}
			triggerChildren={
				<Button variant="ghost" isFullyRounded className="group/delete p-3">
					<Trash2 className="group-hover/delete:text-destructive size-5 transition-colors" />
				</Button>
			}
			title={`Delete ${channelName} channel?`}
		>
			<p className="text-muted-foreground">
				Are you sure you want to delete the channel{' '}
				<span className="italic">{channelName}</span>?
			</p>

			<div className="mt-4 flex justify-center gap-4">
				<Button
					colorScheme="destructive"
					onPress={() =>
						mutate(
							{
								organizationId: params.organizationId,
								channelId,
							},
							{
								onSuccess: ({ message, title }) => {
									toast({
										title,
										content: message,
										variant: 'success',
									});
									setIsOpen(false);
								},
								onError: ({ message, title }) => {
									toast({
										title,
										content: message,
										variant: 'error',
									});
								},
							}
						)
					}
				>
					Yes
				</Button>
				<Button colorScheme="bland" variant="outline" slot="close">
					No
				</Button>
			</div>
		</Dialog>
	);
});
