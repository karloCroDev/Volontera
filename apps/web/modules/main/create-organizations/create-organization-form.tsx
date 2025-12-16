'use client';

// External packages
import { Camera, Plus } from 'lucide-react';
import * as React from 'react';
import { Form, Radio, RadioGroup } from 'react-aria-components';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';
import { RadioIconVisual } from '@/components/ui/radio';

export const CreateOrganizationForm = () => {
	const [assignTasks, setAssignTasks] = React.useState(false);
	return (
		<>
			<Layout>
				<LayoutColumn
					start={{
						base: 1,
						lg: 3,
					}}
					end={{
						base: 13,
						lg: 9,
					}}
					className="flex flex-col"
				>
					<Form>
						<div className="flex gap-4">
							<div className="border-input-border text-muted-foreground flex min-h-80 flex-1 flex-col items-center justify-center rounded-2xl border border-dashed">
								<Camera />
								<p>Insert avatar photo </p>
								<p>(optional)</p>
							</div>
							<div className="border-input-border text-muted-foreground flex min-h-80 flex-1 flex-col items-center justify-center rounded-2xl border border-dashed">
								<Camera />
								<p>Insert avatar photo </p>
								<p>(optional)</p>
							</div>
						</div>

						<div className="mt-8 flex flex-col gap-6">
							<div>
								<Label>Organization&apos;s name</Label>
								<Input label="Enter your oganizations name" className="mt-2" />
							</div>
							<div>
								<Label>Organization&apos;s bio</Label>
								<Input label="Enter your organization's bio" className="mt-2" />
							</div>
							<div>
								<Label>Organization type</Label>
								<Input
									label="Enter more information about the organization"
									className="mt-2"
								/>
							</div>
							<div>
								<Label isOptional>Additional Links</Label>
								<Input label="Enter your additional links" className="mt-2" />
							</div>
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
					</Form>
					<hr className="bg-input-border my-8 h-px w-full border-0" />

					<Button size="md" className="self-end">
						Let&apos; go
					</Button>
				</LayoutColumn>
			</Layout>
		</>
	);
};
