'use client';

// External packages
import { Camera, Plus } from 'lucide-react';
import * as React from 'react';
import { Form, Radio, RadioGroup } from 'react-aria-components';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';
import { RadioIconVisual } from '@/components/ui/radio';

// Modules
import { InsertPhoto } from '@/modules/main/create-organizations/insert-photo';

// Schemas
import {
	CreateOrganizationArgs,
	createOrganizationSchema,
} from '@repo/schemas/create-organization';

export const CreateOrganizationForm = () => {
	// TODO: Decide where to put this, under the creation of new board or here
	const [assignTasks, setAssignTasks] = React.useState(false);

	const { control, handleSubmit } = useForm<CreateOrganizationArgs>({
		context: zodResolver(createOrganizationSchema),
		defaultValues: {
			organization_name: '',
			organization_bio: '',
			organization_type: '',
			external_form_link: undefined,
			additional_links: [],
			assignPredefinedTasks: false,
		},
	});

	const onSubmit = (data: CreateOrganizationArgs) => {};
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
							<InsertPhoto htmlFor="avatar-photo">
								Insert organization <strong>avatar</strong> photo
							</InsertPhoto>
							<InsertPhoto htmlFor="cover-photo">
								Insert organization <strong>cover</strong> photo
							</InsertPhoto>
						</div>

						<div className="mt-8 flex flex-col gap-6">
							<div>
								<Label>Organization&apos;s name</Label>
								<Input label="Enter your oganizations name" className="mt-2" />
							</div>
							<div>
								<Label>Organization&apos;s bio</Label>

								<Controller
									control={control}
									name="organization_bio"
									render={() => (
										<Input
											label="Enter your organization's bio"
											className="mt-2"
										/>
									)}
								/>
							</div>
							<div>
								<Label>Organization type</Label>

								<Controller
									control={control}
									name="organization_type"
									render={() => (
										<Input
											label="Enter more information about the organization"
											className="mt-2"
										/>
									)}
								/>
							</div>

							<div>
								<Label isOptional>Additional Links</Label>

								<Controller
									control={control}
									name="additional_links"
									render={() => (
										<Input
											label="Enter your additional links"
											className="mt-2"
										/>
									)}
								/>
							</div>
							{/* TODO: Probabbly new separate component  and better naming*/}
							<div>
								<Label isOptional>Embbedd the form link</Label>

								<Controller
									control={control}
									name="external_form_link"
									render={() => (
										<Input label="Enter your form link" className="mt-2" />
									)}
								/>
							</div>

							{/* If there is a link that I can embedd then display preview immeditelly */}

							{/* <div>
								<p className="lg:text-md text-muted-foreground mb-2">
									(Preview)
								</p>

								<iframe
									src="https://docs.google.com/forms/d/e/1FAIpQLSeJ_PbnTvmK3edUaCQl6QFL7N86EZXnIhCgKEMMRObrbrMxdg/viewform?embedded=true"
									className="border-input-border aspect-[4/3] w-full rounded-lg border"
								/>
							</div> */}

							<Button
								colorScheme="yellow"
								variant="outline"
								className="self-end p-2"
							>
								<Plus />
							</Button>

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

						<Button size="md" className="ml-auto" type="submit">
							Let&apos; go
						</Button>
					</Form>
				</LayoutColumn>
			</Layout>
		</>
	);
};
