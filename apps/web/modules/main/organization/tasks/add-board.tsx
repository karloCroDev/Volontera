'use client';

// External packages
import * as React from 'react';
import { Plus } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Form, Radio, RadioGroup } from 'react-aria-components';
import { RadioIconVisual } from '@/components/ui/radio';

export const AddBoard = () => {
	const [assignTasks, setAssignTasks] = React.useState(false);

	return (
		<Dialog
			title="Add new board"
			subtitle="Please enter the information about your organization inside these fields"
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
			<Form className="flex flex-col gap-4 overflow-y-scroll">
				<div>
					<Label className="mb-2">Title</Label>
					<Input label="Enter your post title" />
				</div>

				<div>
					<Label isOptional>Assign predefined tasks (PRO)</Label>
					<p className="text-muted-foreground text-sm">
						Assign predefined tasks with the data you have entered in previous
						fields
					</p>
					<div className="mt-4 flex justify-center gap-4">
						<RadioGroup
							className="flex gap-8"
							onChange={(val) => setAssignTasks(val === 'YES' ? true : false)}
							defaultValue={assignTasks ? 'YES' : 'NO'}
						>
							<Radio className="group flex items-center gap-4" value="YES">
								<RadioIconVisual />

								<p>Yes</p>
							</Radio>
							<Radio className="group flex items-center gap-4" value="NO">
								<RadioIconVisual />
								<p>No</p>
							</Radio>
						</RadioGroup>
					</div>
				</div>
				<Button type="submit" className="self-end" size="md">
					Submit
				</Button>
			</Form>
		</Dialog>
	);
};
