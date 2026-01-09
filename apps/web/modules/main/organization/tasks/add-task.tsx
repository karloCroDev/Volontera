'use client';

// External packages
import * as React from 'react';
import { Plus } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox, CheckboxGroup, Form } from 'react-aria-components';
import { DatePicker } from '@/components/ui/date-picker';
import { Tag } from '@/components/ui/tag';
import { Avatar } from '@/components/ui/avatar';
import { CheckboxVisually } from '@/components/ui/checkbox';
import { convertCalendarDate } from '@/lib/utils/converter';

export const AddTask = () => {
	const [assignedMemberIds, setAssignedMemberIds] = React.useState<string[]>([
		'0',
	]);

	return (
		<Dialog
			title="Add new task"
			subtitle="Please enter the information about your organization inside these fields"
			triggerChildren={
				<Button isFullyRounded variant="outline" iconRight={<Plus />}>
					Add Card
				</Button>
			}
		>
			<Form className="flex flex-col gap-4 overflow-y-scroll">
				<div>
					<Label className="mb-2">Title</Label>
					<Input label="Enter your board title" />
				</div>
				<div>
					<Label className="mb-2">Due date</Label>
					<DatePicker
						onChange={(val) => {
							if (!val) return;

							const formatted = convertCalendarDate(val);

							// onChange(formatted);
						}}
					/>
				</div>
				<div className="w-full">
					<Label className="mb-2">Assgin members</Label>

					<CheckboxGroup
						value={assignedMemberIds}
						onChange={setAssignedMemberIds}
						className="mx-auto flex w-fit flex-wrap gap-3"
					>
						{[...Array(4)].map((_, indx) => {
							return (
								<Checkbox className="group" key={indx} value={indx.toString()}>
									<Tag className="flex items-center gap-4">
										<Avatar
											imageProps={{
												src: '',
											}}
											size="xs"
										>
											Ante
										</Avatar>
										<p>Ante</p>

										<CheckboxVisually
											className="rounded-full"
											variant="secondary"
										/>
									</Tag>
								</Checkbox>
							);
						})}
					</CheckboxGroup>
				</div>

				<Button type="submit" className="self-end" size="md">
					Submit
				</Button>
			</Form>
		</Dialog>
	);
};
