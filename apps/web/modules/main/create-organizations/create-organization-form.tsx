'use client';

// External packages
import { Minus, Plus } from 'lucide-react';
import * as React from 'react';
import { Form, Radio, RadioGroup } from 'react-aria-components';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';
import { RadioIconVisual } from '@/components/ui/radio';

// Modules
import { InsertPhoto } from '@/modules/main/create-organizations/insert-photo';
import { PreviewForm } from '@/modules/main/create-organizations/preview-form';

// Lib
import { toast } from '@/lib/utils/toast';

// Schemas
import {
	CreateOrganizationArgs,
	createOrganizationSchema,
} from '@repo/schemas/create-organization';
import { useCreateOrganization } from '@/hooks/data/organization';

export const CreateOrganizationForm = () => {
	// TODO: Decide where to put this, under the creation of new board or here
	const [assignTasks, setAssignTasks] = React.useState(false);
	const [avatarFile, setAvatarFile] = React.useState<File | undefined>();
	const [coverFile, setCoverFile] = React.useState<File | undefined>();

	const { mutate, isPending } = useCreateOrganization();
	const {
		control,
		handleSubmit,
		setError,
		watch,
		formState: { errors },
	} = useForm<CreateOrganizationArgs>({
		context: zodResolver(createOrganizationSchema),
		defaultValues: {
			organization_avatar_image: undefined,
			organization_cover_image: undefined,
			organization_name: '',
			organization_bio: '',
			organization_type: '',
			organization_location: '',
			external_form_link: '',
			additional_links: [''],
			assignPredefinedTasks: false,
		},
	});

	const {
		fields: arrFields,
		append,
		remove,
	} = useFieldArray({
		control,
		name: 'additional_links' as unknown as never,
	});

	React.useEffect(() => {
		if (arrFields.length === 0) {
			append('');
		}
	}, [arrFields.length, append]);

	const router = useRouter();
	const onSubmit = (data: CreateOrganizationArgs) => {
		console.log(data);
		const cleanedAdditionalLinks = (data.additional_links || [])
			.map((l) => l.trim())
			.filter((l) => l.length > 0);

		const payload: CreateOrganizationArgs = {
			...data,
			external_form_link: data.external_form_link?.trim()
				? data.external_form_link.trim()
				: undefined,
			additional_links: cleanedAdditionalLinks.length
				? cleanedAdditionalLinks
				: undefined,
			assignPredefinedTasks: assignTasks,
		};

		mutate(payload, {
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
		});
	};

	const externalFormLink = watch('external_form_link') ?? '';

	return (
		<>
			<Layout>
				<LayoutColumn
					start={{
						base: 1,
						// Malo od manje centra (bolje izgleda)
						md: 4,
						xl: 3,
					}}
					end={{
						base: 13,
						// Malo od manje centra (bolje izgleda)
						md: 10,
						xl: 9,
					}}
					className="flex flex-col"
				>
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
										<Input
											label="Enter your organization's bio"
											className="mt-2"
											inputProps={field}
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
									<Controller
										key={field.id}
										control={control}
										name={`additional_links.${index}` as const}
										render={({ field }) => (
											<Input
												label="Enter your additional links"
												className="mt-2"
												inputProps={field}
												error={errors.additional_links?.[index]?.message}
											/>
										)}
									/>
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
									onPress={() => append('')}
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

							<hr className="bg-input-border h-px w-full border-0" />
							<h4 className="text-xl italic underline underline-offset-4">
								Addtional features
							</h4>
							<div>
								<Label isOptional>Assign predefined tasks (PRO)</Label>
								<p className="text-muted-foreground text-sm">
									Assign predefined tasks with the data you have entered in
									previous fields
								</p>
								<div className="mt-4 flex justify-center gap-4">
									<RadioGroup
										className="flex gap-8"
										onChange={(val) =>
											setAssignTasks(val === 'YES' ? true : false)
										}
										defaultValue={assignTasks ? 'YES' : 'NO'}
									>
										<Radio
											className="group flex items-center gap-4"
											value="YES"
										>
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
						</div>
						<hr className="bg-input-border my-8 h-px w-full border-0" />

						<Button
							size="md"
							className="ml-auto"
							type="submit"
							isDisabled={isPending}
						>
							Let&apos;s go
						</Button>
					</Form>
				</LayoutColumn>
			</Layout>
		</>
	);
};
