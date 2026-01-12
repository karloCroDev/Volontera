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

export const EditBoard = () => {
	const [isEditBoardOpen, setIsEditBoardOpen] = React.useState(false);
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
				<div>
					<Label className="mb-2" isOptional>
						Description
					</Label>
					<Textarea label="Enter your description" />
				</div>

				<div className="flex justify-between">
					<DeleteBoardConfirmation
						boardId=""
						boardName="s"
						setIsEditBoardOpen={setIsEditBoardOpen}
					/>
					<Button type="submit" size="md">
						Submit
					</Button>
				</div>
			</Form>
		</Dialog>
	);
};

const DeleteBoardConfirmation: React.FC<{
	boardName: string;
	boardId: string;
	setIsEditBoardOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ boardId, boardName, setIsEditBoardOpen }) => {
	return (
		<Dialog
			title={`Delete board ${boardName}?`}
			triggerChildren={
				<Button
					type="button"
					variant="outline"
					colorScheme="destructive"
					size="md"
				>
					{/* Enter board name */}
					Delete board?
				</Button>
			}
			// isOpen={isOpen}
			// onOpenChange={setIsOpen}
		>
			<p className="text-muted-foreground">
				Are you sure you want to delete your post? This action cannot be undone.
			</p>

			<div className="mt-4 flex justify-center gap-4">
				<Button
					// type="submit"
					colorScheme="destructive"
					onPress={() => {
						setIsEditBoardOpen(false);
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
