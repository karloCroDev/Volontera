'use client';

// External packages
import * as React from 'react';
import { Plus } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Form } from 'react-aria-components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';

// Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// Schemas
import {
	CreateTaskBoardArgs,
	createTaskBoardSchema,
} from '@repo/schemas/organization-tasks';

// Hooks
import { useCreateTaskBoard } from '@/hooks/data/organization-tasks';

// Lib
import { toast } from '@/lib/utils/toast';

export const AddBoardDialog = () => {
	const [assignTasks, setAssignTasks] = React.useState(false);

	const [isOpen, setIsOpen] = React.useState(false);
	const params = useParams<{ organizationId: string }>();
	const {
		handleSubmit,
		control,
		formState: { errors, isDirty },
		reset,
	} = useForm<CreateTaskBoardArgs>({
		resolver: zodResolver(createTaskBoardSchema),
		defaultValues: {
			title: '',
			organizationId: params.organizationId,
		},
	});

	const { mutate, isPending } = useCreateTaskBoard();
	const onSubmit = (data: CreateTaskBoardArgs) => {
		mutate(data, {
			onSuccess: ({ message, title }) => {
				toast({
					title,
					content: message,
					variant: 'success',
				});
				reset();
				setIsOpen(false);
			},
			onError: ({ message, title }) => {
				toast({
					title,
					content: message,
					variant: 'error',
				});
			},
		});
	};

	return (
		<Dialog
			title="Add new board"
			subtitle="Please enter the board details below."
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
			isOpen={isOpen}
			onOpenChange={setIsOpen}
		>
			<Form
				className="flex flex-col gap-4 overflow-y-scroll"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div>
					<Label className="mb-2">Title</Label>

					<Controller
						name="title"
						control={control}
						render={({ field }) => (
							<Input
								label="Enter your post title"
								inputProps={field}
								error={errors.title?.message}
							/>
						)}
					/>
				</div>

				{/* <div>
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
				</div> */}
				<Button
					type="submit"
					className="self-end"
					size="md"
					isLoading={isPending}
					isDisabled={!isDirty || isPending}
				>
					Submit
				</Button>
			</Form>
		</Dialog>
	);
};
