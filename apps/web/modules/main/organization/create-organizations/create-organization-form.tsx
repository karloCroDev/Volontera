'use client';

// External packages
import { Minus, Plus } from 'lucide-react';
import * as React from 'react';
import { Form } from 'react-aria-components';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Modules
import { InsertPhoto } from '@/modules/main/organization/create-organizations/insert-photo';
import { PreviewForm } from '@/modules/main/organization/create-organizations/preview-form';

// Lib
import { toast } from '@/lib/utils/toast';

// Schemas
import {
	CreateOrganizationArgs,
	createOrganizationSchema,
} from '@repo/schemas/organization';
import { useCreateOrganization } from '@/hooks/data/organization';
import { Error } from '@/components/ui/error';
import { Textarea } from '@/components/ui/textarea';

export const CreateOrganizationForm = () => {
	const [avatarFile, setAvatarFile] = React.useState<File | undefined>();
	const [coverFile, setCoverFile] = React.useState<File | undefined>();

	const { mutate, isPending } = useCreateOrganization();
	const {
		control,
		handleSubmit,
		setError,
		watch,
		formState: { errors, isDirty },
	} = useForm<CreateOrganizationArgs>({
		resolver: zodResolver(createOrganizationSchema),
		defaultValues: {
			organization_avatar_image: undefined,
			organization_cover_image: undefined,
			organization_name: '',
			organization_bio: '',
			organization_type: '',
			organization_location: '',
			external_form_link: '',
			additional_links: [{ label: '', url: '' }],
			assignPredefinedTasks: false,
		},
	});

	const {
		fields: arrFields,
		append,
		remove,
	} = useFieldArray({
		control,
		name: 'additional_links' as never,
	});

	const router = useRouter();
	const onSubmit = (data: CreateOrganizationArgs) => {
		const files = [];
		if (avatarFile) files.push(avatarFile);
		if (coverFile) files.push(coverFile);
		mutate(
			{
				data,
				files: files.length > 0 ? files : undefined,
			},
			{
				onSuccess({ message, title, organizationId }) {
					toast({
						title,
						content: message,
						variant: 'success',
					});

					router.push(`/organization/${organizationId}`);
				},
				onError({ message }) {
					setError('root', {
						message,
					});
				},
			}
		);
	};

	const externalFormLink = watch('external_form_link') ?? '';

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<div className="flex gap-4">
				<Controller
					control={control}
					name="organization_avatar_image"
					render={({ field: { onChange } }) => (
						<InsertPhoto
							htmlFor="avatar-photo"
							file={avatarFile}
							onFileChange={(file) => {
								setAvatarFile(file);
								if (!file) {
									onChange(undefined);
									return;
								}
								onChange({
									filename: file.name,
									contentType: file.type,
									size: file.size,
								});
							}}
						>
							Insert organization <strong>avatar</strong> photo
						</InsertPhoto>
					)}
				/>
				<Controller
					control={control}
					name="organization_cover_image"
					render={({ field: { onChange } }) => (
						<InsertPhoto
							htmlFor="cover-photo"
							file={coverFile}
							onFileChange={(file) => {
								setCoverFile(file);
								if (!file) {
									onChange(undefined);
									return;
								}
								onChange({
									filename: file.name,
									contentType: file.type,
									size: file.size,
								});
							}}
						>
							Insert organization <strong>cover</strong> photo
						</InsertPhoto>
					)}
				/>
			</div>

			<div className="mt-8 flex flex-col gap-6">
				<div>
					<Label>Organization&apos;s name</Label>
					<Controller
						control={control}
						name="organization_name"
						render={({ field }) => (
							<Input
								label="Enter your organization's name"
								className="mt-2"
								inputProps={field}
								error={errors.organization_name?.message}
							/>
						)}
					/>
				</div>
				<div>
					<Label>Organization&apos;s bio</Label>

					<Controller
						control={control}
						name="organization_bio"
						render={({ field }) => (
							<Textarea
								label="Enter your organization's bio"
								className="mt-2"
								textAreaProps={field}
								error={errors.organization_bio?.message}
							/>
						)}
					/>
				</div>
				<div>
					<Label>Organization type</Label>

					<Controller
						control={control}
						name="organization_type"
						render={({ field }) => (
							<Input
								label="Enter more information about the organization"
								className="mt-2"
								inputProps={field}
								error={errors.organization_type?.message}
							/>
						)}
					/>
				</div>
				<div>
					<Label isOptional>Organization location</Label>

					<Controller
						control={control}
						name="organization_location"
						render={({ field }) => (
							<Input
								label="Enter the location (if it exists)"
								className="mt-2"
								inputProps={field}
								error={errors.organization_location?.message}
							/>
						)}
					/>
				</div>

				<div>
					<Label isOptional>Additional Links</Label>

					{arrFields.map((field, index) => (
						<div key={field.id} className="flex gap-4">
							<Controller
								control={control}
								name={`additional_links.${index}.label` as const}
								render={({ field }) => (
									<Input
										label="Enter the name"
										className="mt-2"
										inputProps={field}
										error={errors.additional_links?.[index]?.label?.message}
									/>
								)}
							/>
							<Controller
								control={control}
								name={`additional_links.${index}.url` as const}
								render={({ field }) => (
									<Input
										label="Enter the URL"
										className="min-w-3/5 mt-2 flex-1"
										inputProps={field}
										error={errors.additional_links?.[index]?.url?.message}
									/>
								)}
							/>
						</div>
					))}
				</div>

				<div className="flex justify-between">
					{arrFields.length > 1 && (
						<Button
							colorScheme="destructive"
							variant="outline"
							className="p-2"
							onPress={() => remove(arrFields.length - 1)}
						>
							<Minus />
						</Button>
					)}
					<Button
						colorScheme="yellow"
						variant="outline"
						className="ml-auto p-2"
						onPress={() => append({ label: '', url: '' } as never)}
					>
						<Plus />
					</Button>
				</div>
				<hr className="bg-input-border h-px w-full border-0" />

				<h4 className="text-xl italic underline underline-offset-4">
					Joinment information{' '}
				</h4>
				<div>
					<div className="flex items-baseline justify-between">
						<Label isOptional>Embbedd the form link </Label>

						{externalFormLink.length > 0 && (
							<PreviewForm src={externalFormLink} />
						)}
					</div>
					<Controller
						control={control}
						name="external_form_link"
						render={({ field }) => (
							<Input
								label="Enter your form link"
								className="mt-2"
								inputProps={field}
								error={errors.external_form_link?.message}
							/>
						)}
					/>
				</div>

				<Error>{errors.root?.message}</Error>
			</div>

			<Button
				size="md"
				className="ml-auto"
				type="submit"
				isDisabled={isPending || !isDirty}
				isLoading={isPending}
			>
				Let&apos;s go
			</Button>
		</Form>
	);
};
