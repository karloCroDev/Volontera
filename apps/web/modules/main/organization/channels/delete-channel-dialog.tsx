'use client';

// External packages
import * as React from 'react';

// Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

export const DeleteChannelDialog: React.FC<{
	channelName: string;
}> = ({ channelName }) => {
	return (
		<Dialog
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
				<Button colorScheme="destructive">Yes</Button>
				<Button colorScheme="bland" variant="outline" slot="close">
					No
				</Button>
			</div>
		</Dialog>
	);
};
