'use client';

// External packages
import * as React from 'react';
import { Plus } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

export const AddTask = () => {
	return (
		<Dialog
			title="Addd"
			triggerChildren={
				<Button
					colorScheme="yellow"
					variant="outline"
					isFullyRounded
					iconRight={<Plus />}
				>
					Add Board
				</Button>
			}
		>
			<p>dd</p>
		</Dialog>
	);
};
