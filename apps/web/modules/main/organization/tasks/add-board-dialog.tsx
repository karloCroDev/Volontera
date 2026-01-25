'use client';

// External packages
import * as React from 'react';
import { Plus } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Form, Radio, RadioGroup } from 'react-aria-components';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';

// Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioIconVisual } from '@/components/ui/radio';

// Schemas
import {
	CreateTaskBoardArgs,
	createTaskBoardSchema,
} from '@repo/schemas/organization-tasks';

// Hooks
import { useCreateTaskBoard } from '@/hooks/data/organization-tasks';

// Lib
import { toast } from '@/lib/utils/toast';
import { Textarea } from '@/components/ui/textarea';

export const AddBoardDialog = () => {
	const [isOpen, setIsOpen] = React.useState(false);
	const params = useParams<{ organizationId: string }>();
	const {
		handleSubmit,
		control,
		formState: { errors, isDirty },
		watch,
		reset,
	} = useForm<CreateTaskBoardArgs>({
		resolver: zodResolver(createTaskBoardSchema),
		defaultValues: {
			title: '',
			organizationId: params.organizationId,
			generateTasksWithAi: false,
			descriptionAi: '',
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

				reset({
					title: '',
					organizationId: params.organizationId,
					generateTasksWithAi: false,
					descriptionAi: '',
				});
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
					className="flex-shrink-0"
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
								label="Enter your board title"
								inputProps={field}
								error={errors.title?.message}
							/>
						)}
					/>
				</div>

				<hr className="bg-input-border h-px w-full flex-shrink-0 border-0" />
				<div>
					<Label isOptional>Assign predefined tasks (PRO)</Label>
					<p className="text-muted-foreground text-sm">
						Assign predefined tasks with the data you have entered in previous
						fields
					</p>
					<div className="mt-4 flex justify-center gap-4">
						<Controller
							name="generateTasksWithAi"
							control={control}
							render={({ field }) => (
								<RadioGroup
									className="flex gap-8"
									defaultValue="NO"
									onChange={(val) =>
										field.onChange(val === 'YES' ? true : false)
									}
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
							)}
						/>
					</div>
				</div>

				{watch('generateTasksWithAi') && (
					<div>
						<Label isOptional className="mb-2">
							Description for tasks (AI)
						</Label>

						<Controller
							name="descriptionAi"
							control={control}
							render={({ field }) => (
								<Textarea
									label="Enter your tasks for AI"
									textAreaProps={field}
									error={errors.descriptionAi?.message}
								/>
							)}
						/>
					</div>
				)}
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
