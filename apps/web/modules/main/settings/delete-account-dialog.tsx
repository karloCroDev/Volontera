// External packages
import * as React from 'react';
import { useRouter } from 'next/navigation';

// Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

// Hooks
import { useDeleteAccount } from '@/hooks/data/settings';

// Lib
import { toast } from '@/lib/utils/toast';

export const DeleteAccountDialog = () => {
	const { mutate, isPending } = useDeleteAccount();
	const router = useRouter();
	return (
		<Dialog
			triggerChildren={
				<Button
					variant="outline"
					colorScheme="destructive"
					className="mb-auto xl:mb-0 xl:mt-auto"
				>
					Delete account
				</Button>
			}
			title="Delete your account?"
		>
			<p className="text-muted-foreground">
				Are you sure you want to delete your account? This action cannot be
				undone.
			</p>

			{/* Ako korisnik ima */}
			<div className="mt-4 flex justify-center gap-4">
				<Button
					colorScheme="destructive"
					onPress={() => {
						mutate(undefined, {
							onSuccess: ({ title, message }) => {
								toast({ title, content: message, variant: 'success' });
								router.push('/auth/login');
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
