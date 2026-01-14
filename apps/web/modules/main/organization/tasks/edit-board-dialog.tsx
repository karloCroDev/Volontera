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
import {
	useDeleteOrganizationTaskBoard,
	useRetrieveTaskInfo,
} from '@/hooks/data/organization-tasks';
import { useParams } from 'next/navigation';
import { toast } from '@/lib/utils/toast';

export const EditBoardDialog: React.FC<{
	title: string;
	boardId: string;
}> = ({ title, boardId }) => {
	// TODO: Retrieve board info and populate the fields

	const params = useParams<{ organizationId: string }>();
	const { mutate } = useDeleteOrganizationTaskBoard();
	return (
		<Dialog
			title={`Edit board: ${title}`}
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
						action={() =>
							mutate(
								{
									organizationId: params.organizationId,
									organizationTaskBoardId: boardId,
								},
								{
									onSuccess: ({ message, title }) => {
										toast({
											title,
											content: message,
											variant: 'success',
										});
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
						name={title}
					/>
					<Button type="submit" size="md">
						Submit
					</Button>
				</div>
			</Form>
		</Dialog>
	);
};
