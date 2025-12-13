'use client';

// External packages
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { parseDate } from '@internationalized/date';

// Components
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { FilledInput } from '@/components/ui/filled-input';

// Schemas
import { SettingsArgs } from '@repo/schemas/settings';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';

// Hpoks
import { useSession } from '@/hooks/data/auth';

// Modules
import { DeleteAccountDialog } from '@/modules/main/settings/delete-account-dialog';

export const PersonalInformationForm = withReactQueryProvider(() => {
	// Pull formState.errors from useFormContext to access all validation errors,
	// or use Controller's fieldState.error inside each render callback.
	const {
		control,
		formState: { errors },
	} = useFormContext<SettingsArgs>();

	const { data: user } = useSession();

	console.log(user?.address);
	return (
		<div className="border-input-border mt-10 flex flex-col justify-between gap-8 rounded-md border p-6 lg:p-8 xl:flex-row 2xl:p-10">
			<div className="flex justify-between xl:flex-col">
				<div>
					<h4 className="text-lg font-semibold">Personal information</h4>
					<p className="text-muted-foreground mt-2">
						More information about you to others
					</p>
				</div>
				<DeleteAccountDialog />
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
							// use fieldState to get the specific error for this controller
							render={({ field: { onChange } }) => {
								return (
									<>
										<DatePicker
											value={user?.DOB ? parseDate(user.DOB) : undefined}
											onChange={(val) => {
												if (!val) return;
												const formatted = `${String(val.year).padStart(2, '0')}-${String(val.month).padStart(2, '0')}-${val.day}`;
												onChange(formatted);
											}}
										/>
										{errors.DOB && (
											<p className="text-destructive mt-1.5">
												{errors.DOB.message}
											</p>
										)}
									</>
								);
							}}
						/>
					</div>
					<div>
						<Label isOptional className="mb-2">
							Work or School
						</Label>
						<Controller
							control={control}
							name="workOrSchool"
							render={({ field }) => {
								return (
									<>
										{!user?.workOrSchool ? (
											<Input
												label="Work or School"
												inputProps={field}
												error={errors.workOrSchool?.message}
											/>
										) : (
											<FilledInput
												placeholderValue="Work or School"
												label={user.workOrSchool}
												className="mt-2"
												inputProps={field}
												error={errors.workOrSchool?.message}
											/>
										)}
									</>
								);
							}}
						/>
					</div>
					<div>
						<Label isOptional className="mb-2">
							Address
						</Label>
						<Controller
							control={control}
							name="address"
							render={({ field }) => {
								return (
									<>
										{!user?.address ? (
											<Input
												label="Address"
												inputProps={field}
												error={errors.workOrSchool?.message}
											/>
										) : (
											<FilledInput
												placeholderValue="Address"
												label={user.address}
												className="mt-2"
												inputProps={field}
												error={errors.address?.message}
											/>
										)}
									</>
								);
							}}
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
								<Textarea
									label="Bio"
									textAreaProps={{
										...field,
									}}
									error={errors.bio?.message}
								/>
							)}
						/>
					</div>
				</div>
			</div>
		</div>
	);
});
