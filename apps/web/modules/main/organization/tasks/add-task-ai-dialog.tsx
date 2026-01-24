'use client';

// External packages
import * as React from 'react';
import { Sparkles } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

// Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox, CheckboxGroup, Form } from 'react-aria-components';
import { Tag } from '@/components/ui/tag';
import { Avatar } from '@/components/ui/avatar';
import { CheckboxVisually } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Error } from '@/components/ui/error';

// Lib
import { convertToFullname } from '@/lib/utils/converter';
import { useParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

// Schemas
import {
	CreateLlmTaskArgs,
	createLlmTaskSchema,
} from '@repo/schemas/organization-tasks';

// Hooks
import {
	useCreateLlmTask,
	useRetrieveOrganizationMembers,
} from '@/hooks/data/organization-tasks';

// Lib
import { toast } from '@/lib/utils/toast';

export const AddTaskAiDialog: React.FC<{
	organizationTasksBoardId: string;
}> = ({ organizationTasksBoardId }) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const params = useParams<{ organizationId: string }>();
	const { data: organizationMembersData } = useRetrieveOrganizationMembers({
		organizationId: params.organizationId,
	});
	const {
		handleSubmit,
		control,
		formState: { errors, isDirty },
		reset,
	} = useForm<CreateLlmTaskArgs>({
		resolver: zodResolver(createLlmTaskSchema),
		defaultValues: {
			organizationTasksBoardId,
			title: '',
			description: '',
			assignedMembers: [],
			organizationId: params.organizationId,
		},
	});

	const { mutate, isPending } = useCreateLlmTask();
	const onSubmit = (data: CreateLlmTaskArgs) => {
		mutate(data, {
			onSuccess: ({ message, title }) => {
				toast({
					title,
					content: message,
					variant: 'success',
				});

				reset({
					description: '',
					title: '',
					assignedMembers: [],
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
			onOpenChange={setIsOpen}
			isOpen={isOpen}
			title="Add new task with AI"
			subtitle="Please enter the information, so that AI can generate a task for you."
			dialogProps={{
				className: 'max-h-[600px] overflow-y-scroll',
			}}
			triggerChildren={
				<Button
					isFullyRounded
					variant="outline"
					colorScheme="yellow"
					type="button"
				>
					<Sparkles />
				</Button>
			}
		>
			<Form
				className="flex flex-col gap-4 overflow-y-scroll"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div>
					<Label className="mb-2">Title</Label>
					<Controller
						control={control}
						name="title"
						render={({ field }) => (
							<Input
								label="Enter your board title"
								inputProps={field}
								error={errors.title?.message}
							/>
						)}
					/>
				</div>
				<div>
					<Label className="mb-2" isOptional>
						Description (AI)
					</Label>
					<Controller
						control={control}
						name="description"
						render={({ field }) => (
							<Textarea
								label="Enter your task AI description"
								textAreaProps={field}
								error={errors.description?.message}
							/>
						)}
					/>
				</div>

				<div className="w-full">
					<Label className="mb-2">Assgin members</Label>
					<Controller
						control={control}
						name="assignedMembers"
						render={({ field }) => (
							<CheckboxGroup
								value={field.value}
								onChange={field.onChange}
								className="flex w-fit flex-wrap gap-3"
							>
								{organizationMembersData?.organizationMembers?.map((member) => (
									<Checkbox className="group" key={member.id} value={member.id}>
										<Tag className="flex items-center gap-4">
											<Avatar
												imageProps={{
													src: member.user.image || '',
												}}
												isVerified={member.user.subscriptionTier === 'PRO'}
												size="xs"
											>
												{convertToFullname({
													firstname: member.user.firstName,
													lastname: member.user.lastName,
												})}
											</Avatar>
											<p>
												{convertToFullname({
													firstname: member.user.firstName,
													lastname: member.user.lastName,
												})}
											</p>

											<CheckboxVisually
												className="rounded-full"
												variant="secondary"
											/>
										</Tag>
									</Checkbox>
								))}
							</CheckboxGroup>
						)}
					/>

					<Error>{errors.assignedMembers?.message}</Error>
				</div>

				<Button
					type="submit"
					className="self-end"
					size="md"
					isDisabled={!isDirty || isPending}
					isLoading={isPending}
				>
					Submit
				</Button>
			</Form>
		</Dialog>
	);
};
