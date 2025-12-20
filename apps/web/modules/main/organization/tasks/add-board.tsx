'use client';

// External packages
import * as React from 'react';
import { Plus } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Form } from 'react-aria-components';
import { DatePicker } from '@/components/ui/date-picker';
import { ComboBoxItems, ComboBoxWrapper } from '@/components/ui/combo-box';

export const AddBoard = () => {
	const [addedMembers, setAddedMembers] = React.useState<string[]>([]);

	const [currentMember, setCurrentMember] = React.useState<{
		id: string;
		name: string;
	}>({
		id: '',
		name: '',
	});
	console.log(currentMember);
	return (
		<Dialog
			title="Add new board"
			subtitle=""
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
					<Label className="mb-2">Due date</Label>
					<DatePicker
						onChange={(val) => {
							if (!val) return;
							const formatted = `${String(val.year).padStart(2, '0')}-${String(val.month).padStart(2, '0')}-${val.day}`;
							// onChange(formatted);
						}}
					/>
				</div>
				<div>
					<Label className="mb-2">Assgin members</Label>

					<div className="flex justify-between gap-4">
						<ComboBoxWrapper
							className="w-full"
							inputProps={{
								label: 'Enter members names to assign them',
								onChange: (e) =>
									setCurrentMember({ id: '', name: e.target.value }),
								value: currentMember.name,
							}}
						>
							<ComboBoxItems>Hello world</ComboBoxItems>
							<ComboBoxItems>Ana</ComboBoxItems>
							<ComboBoxItems>Aaa</ComboBoxItems>
							<ComboBoxItems removeUnderline>Hello world</ComboBoxItems>
						</ComboBoxWrapper>

						<Button
							className="aspect-square"
							variant="outline"
							colorScheme="yellow"
						>
							<Plus className="size-5" />
						</Button>
					</div>
				</div>

				<Button type="submit" className="self-end" size="md">
					Submit
				</Button>
			</Form>
		</Dialog>
	);
};
