'use client';

// External packages
import * as React from 'react';
import { Trash2 } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

// Hooks
import { useDeleteHelpConversation } from '@/hooks/data/help';

// Lib
import { toast } from '@/lib/utils/toast';

export const DeleteOrganizationDialog = () => {
	const [open, setOpen] = React.useState(false);
	const { mutate, isPending } = useDeleteHelpConversation();

	return (
		<Dialog
			isOpen={open}
			onOpenChange={setOpen}
			triggerChildren={
				<Button variant="outline" colorScheme="destructive">
					Delete Organization
				</Button>
			}
			title={`Delete organization?`}
		>
			<p className="text-muted-foreground text-balance text-center">
				Are you sure you want to delete this organization? All of the contents
				including the members will be permanently removed. This action cannot be
				undone.
			</p>

			<div className="mt-4 flex justify-center gap-4">
				<Button
					colorScheme="destructive"
					onPress={() => {
						mutate(undefined, {
							onSuccess: ({ title, message }) => {
								setOpen(false);
								toast({ title, content: message, variant: 'success' });
							},
						});
					}}
					isLoading={isPending}
					isDisabled={isPending}
				>
					Yes
				</Button>
				<Button colorScheme="bland" variant="outline" slot="close">
					No
				</Button>
			</div>
		</Dialog>
	);
};
