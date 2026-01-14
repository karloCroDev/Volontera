'use client';

// External packages
import * as React from 'react';

// Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

export const DeleteConfirmation: React.FC<{
	name: string;
	action: () => void;
}> = ({ name, action }) => {
	return (
		<Dialog
			title={`Delete board ${name}?`}
			triggerChildren={
				<Button
					type="button"
					variant="outline"
					colorScheme="destructive"
					size="md"
				>
					{/* Enter board name */}
					Delete {name}
				</Button>
			}
			// isOpen={isOpen}
			// onOpenChange={setIsOpen}
		>
			<p className="text-muted-foreground">
				Are you sure you want to delete your board? This action cannot be
				undone.
			</p>

			<div className="mt-4 flex justify-center gap-4">
				<Button
					// type="submit"
					colorScheme="destructive"
					onPress={() => {
						action();
					}}
				>
					Yes
				</Button>
				<Button
					type="button"
					colorScheme="bland"
					variant="outline"
					slot="close"
				>
					No
				</Button>
			</div>
		</Dialog>
	);
};
