'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';
import { Controller, useForm } from 'react-hook-form';

// Components
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { TextEditor } from '@/components/ui/text-editor/text-editor';
import {
	sendRequestToJoinOrganizationSchema,
	SendRequestToJoinOrganizationArgs,
} from '@repo/schemas/organization';
import { useParams } from 'next/navigation';
import { useSendRequestToJoinOrganization } from '@/hooks/data/organization';
import { toast } from '@/lib/utils/toast';
import { Error } from '@/components/ui/error';

export const JoinDialog = () => {
	const params = useParams<{ organizationId: string }>();

	const {
		handleSubmit,
		control,
		formState: { errors },
		setError,
	} = useForm<SendRequestToJoinOrganizationArgs>({
		context: sendRequestToJoinOrganizationSchema,
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
				},
				onError: (err) => {
					setError('root', err);
				},
			}
		);
	};

	return (
		<Dialog
			triggerChildren={
				<Button colorScheme="orange" size="md">
					Join
				</Button>
			}
			startDesktop={3}
			endDesktop={11}
			title="Join Organization"
			subtitle="Please write a motivational letter to why you should join the organization"
		>
			<Form
				className="no-scrollbar flex max-h-[600px] flex-col gap-4 overflow-y-scroll"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div>
					<Label className="mb-2">Title</Label>

					<Controller
						control={control}
						name="title"
						render={({ field }) => (
							<Input {...field} label="Enter your post title" />
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
								className="mt-2"
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
				<div>
					<Label className="mb-4">Additional Information</Label>

					<iframe
						src="https://docs.google.com/forms/d/e/1FAIpQLSeJ_PbnTvmK3edUaCQl6QFL7N86EZXnIhCgKEMMRObrbrMxdg/viewform?embedded=true"
						className="border-input-border aspect-[4/3] w-full rounded-lg border"
					/>
				</div>
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
		</Dialog>
	);
};
