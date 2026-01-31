// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';

// Components
import { Avatar } from '@/components/ui/avatar';
import { ResizableTextArea } from '@/components/ui/resizable-input';
import { Message } from '@/components/ui/message/message';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

import { useParams } from 'next/navigation';
import {
	useCreateTaskQuestion,
	useDeleteTaskQuestion,
	useRetrieveTaskQuestions,
} from '@/hooks/data/organization-tasks';
import { useSession } from '@/hooks/data/user';
import { Controller, useForm } from 'react-hook-form';
import {
	CreateTaskQuestionArgs,
	createTaskQuestionSchema,
} from '@repo/schemas/organization-tasks';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/lib/utils/toast';
import { convertToFullname } from '@/lib/utils/converter';

export const TaskCardQuestions: React.FC<{
	taskId: string;
}> = ({ taskId }) => {
	const params = useParams<{ organizationId: string }>();
	const { mutate: mutateCreateTaskQuestion, isPending: isCreating } =
		useCreateTaskQuestion();
	const { mutate: mutateRemoveTaskQuestion, isPaused: isDeleting } =
		useDeleteTaskQuestion();
	const { data } = useRetrieveTaskQuestions({
		organizationId: params.organizationId,
		taskId,
	});

	const { data: user } = useSession();

	const {
		control,
		handleSubmit,
		formState: { isDirty },
		reset,
	} = useForm<CreateTaskQuestionArgs>({
		resolver: zodResolver(createTaskQuestionSchema),
		defaultValues: {
			organizationId: params.organizationId,
			question: '',
			taskId,
		},
	});

	const onSubmit = (data: CreateTaskQuestionArgs) => {
		mutateCreateTaskQuestion(data, {
			onSuccess: () => {
				reset({
					question: '',
				});
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
		<Form
			className="relative flex flex-1 flex-col gap-4"
			onSubmit={handleSubmit(onSubmit)}
		>
			<h4 className="mb-4 text-lg underline underline-offset-4 lg:text-xl">
				Questions
			</h4>

			<div className="no-scrollbar max-h-[600px] min-h-60 flex-1 overflow-y-scroll lg:max-h-full">
				{data?.questions.map((question) => (
					<Message
						key={question.id}
						variant={user?.id === question.authorId ? 'primary' : 'secondary'}
						date={new Date(question.createdAt)}
						deleteAction={() => {
							mutateRemoveTaskQuestion({
								organizationId: params.organizationId,
								questionId: question.id,
							});
						}}
						avatar={
							<Avatar
								imageProps={{
									src: question.author.image
										? `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${question.author.image}`
										: undefined,
								}}
								isVerified={question.author.subscriptionTier === 'PRO'}
							>
								{convertToFullname({
									firstname: question.author.firstName,
									lastname: question.author.lastName,
								})}
							</Avatar>
						}
					>
						{question.question}
					</Message>
				))}
			</div>

			<Controller
				control={control}
				name="question"
				render={({ field }) => (
					<ResizableTextArea
						textAreaProps={field}
						className="bg-muted absolute bottom-0 w-full lg:max-w-full"
						label="Enter your questions"
						iconsRight={
							<Button
								type="submit"
								className="p-2"
								isDisabled={!isDirty || isCreating || isDeleting}
								isLoading={isCreating || isDeleting}
							>
								<Send />
							</Button>
						}
					/>
				)}
			/>
		</Form>
	);
};
