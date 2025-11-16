'use client';

// External packages
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

// Components
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';

// Schemas
import { SettingsSchemaArgs } from '@repo/schemas/settings';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';

export const PersonalInformationForm = withReactQueryProvider(() => {
	const { control } = useFormContext<SettingsSchemaArgs>();

	return (
		<div className="border-input-border mt-10 flex flex-col justify-between gap-8 rounded-md border p-6 lg:p-8 xl:flex-row 2xl:p-10">
			<div>
				<h4 className="text-lg font-semibold">Personal information</h4>
				<p className="text-muted-foreground mt-2">
					More information about you to others
				</p>
			</div>

			<div className="flex flex-1 flex-col items-center justify-end gap-12 xl:flex-row xl:items-center">
				<div className="order-2 flex w-full flex-col gap-6 xl:-order-1 xl:w-3/4 2xl:w-3/5">
					<div>
						<Label isOptional className="mb-2">
							DOB
						</Label>

						<Controller
							control={control}
							name="DOB"
							render={({ field: { onChange } }) => (
								<DatePicker
									onChange={(val) => {
										onChange(val);
									}}
								/>
							)}
						/>
					</div>
					<div>
						<Label isOptional className="mb-2">
							Work or School
						</Label>
						<Controller
							control={control}
							name="workOrSchool"
							render={({ field }) => (
								<Input label="Work or School" inputProps={field} />
							)}
						/>
					</div>
					<div>
						<Label isOptional className="mb-2">
							Bio
						</Label>
						<Controller
							control={control}
							name="bio"
							render={({ field }) => (
								<Textarea label="Bio" textAreaProps={field} />
							)}
						/>
					</div>
				</div>
			</div>
		</div>
	);
});
