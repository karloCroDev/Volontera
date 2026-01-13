'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';
import { Ellipsis } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Modules
import { DeleteConfirmation } from '@/modules/main/organization/tasks/delete-confirmaton';
import { useRetrieveTaskInfo } from '@/hooks/data/organization-tasks';

export const EditBoardDialog = () => {
	const [isEditBoardOpen, setIsEditBoardOpen] = React.useState(false);
	// TODO: Retrieve board info and populate the fields
	return (
		<Dialog
			onOpenChange={setIsEditBoardOpen}
			isOpen={isEditBoardOpen}
			title="Edit board"
			subtitle="Please enter the board details below."
			triggerChildren={
				<Button variant="blank">
					<Ellipsis className="text-muted-foreground" />
				</Button>
			}
		>
			<Form className="flex flex-col gap-4 overflow-y-scroll">
				<div>
					<Label className="mb-2">Title</Label>
					<Input label="Enter your board title" />
				</div>

				<div className="flex justify-between">
					<DeleteConfirmation
						action={() => console.log('Wohohoho')}
						id=""
						name="Woah"
					/>
					<Button type="submit" size="md">
						Submit
					</Button>
				</div>
			</Form>
		</Dialog>
	);
};
