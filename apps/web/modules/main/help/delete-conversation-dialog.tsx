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

export const DeleteConversationDialog = () => {
	const [open, setOpen] = React.useState(false);
	const { mutate, isPending } = useDeleteHelpConversation();

	return (
		<Dialog
			isOpen={open}
			onOpenChange={setOpen}
			triggerChildren={
				<Button
					colorScheme="destructive"
					variant="outline"
					className="p-2"
					isLoading={isPending}
					isDisabled={isPending}
				>
					<Trash2 />
				</Button>
			}
			title="Delete your help conversation?"
		>
			<p className="text-muted-foreground">
				Are you sure you want to delete all messages in this conversation? This
				action cannot be undone.
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
