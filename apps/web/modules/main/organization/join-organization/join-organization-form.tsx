'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';
import { Controller, useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';

// Components
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { TextEditor } from '@/components/ui/text-editor/text-editor';
import { Error } from '@/components/ui/error';

// Hooks
import { useSendRequestToJoinOrganization } from '@/hooks/data/organization';

// Scheams
import {
	sendRequestToJoinOrganizationSchema,
	SendRequestToJoinOrganizationArgs,
} from '@repo/schemas/organization';

// Lib
import { toast } from '@/lib/utils/toast';
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

export const JoinOrganizationForm: React.FC<{
	externalForm: string | null;
}> = withReactQueryProvider(({ externalForm }) => {
	const params = useParams<{ organizationId: string }>();
	const router = useRouter();
	const {
		handleSubmit,
		control,
		formState: { errors },
		setError,
	} = useForm<SendRequestToJoinOrganizationArgs>({
		resolver: zodResolver(sendRequestToJoinOrganizationSchema),
		defaultValues: {
			organizationId: params.organizationId,
			title: '',
			content: '',
		},
	});

	const { mutate, isPending } = useSendRequestToJoinOrganization();
	const onSubmit = (data: SendRequestToJoinOrganizationArgs) => {
		mutate(
			{
				...data,
				organizationId: data.organizationId,
			},
			{
				onSuccess: ({ message, title }) => {
					toast({
						title,
						content: message,
						variant: 'success',
					});
					router.push(`/organization/${data.organizationId}`);
				},
				onError: (err) => {
					setError('root', err);
				},
			}
		);
	};

	return (
		<Form
			className="no-scrollbar flex flex-col gap-4 overflow-y-scroll"
			onSubmit={handleSubmit(onSubmit)}
		>
			<div>
				<Label className="mb-2">Title</Label>

				<Controller
					control={control}
					name="title"
					render={({ field }) => (
						<Input
							{...field}
							label="Enter your post title"
							error={errors.title?.message}
						/>
					)}
				/>
			</div>
			<div>
				<Label className="mb-2">Motivational Letter</Label>
				<Controller
					control={control}
					name="content"
					render={({ field }) => (
						<TextEditor
							textEditorProps={{
								className: 'min-h-80',
							}}
							label="Enter your motivational letter content"
							value={field.value}
							setValue={(next) => {
								const nextValue =
									typeof next === 'function' ? next(field.value) : next;
								field.onChange(nextValue);
							}}
							error={errors.content?.message}
						/>
					)}
				/>
			</div>

			{/* Only if there is a link for google docs! */}
			{externalForm && (
				<div>
					<Label className="mb-4">Additional Information</Label>

					<iframe
						src={externalForm}
						className="border-input-border aspect-video w-full rounded-lg border"
					/>
				</div>
			)}
			{errors.root?.message && <Error>{errors.root.message}</Error>}
			<Button
				type="submit"
				className="self-end"
				size="md"
				isDisabled={isPending}
				isLoading={isPending}
			>
				Submit
			</Button>
		</Form>
	);
});
