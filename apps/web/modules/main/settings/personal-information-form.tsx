'use client';

// External packages
import * as React from 'react';
import { Trash } from 'lucide-react';
import { Label as AriaLabel, Input as AriaInput } from 'react-aria-components';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Components
import { Button } from '@/components/ui/button';
import { FilledInput } from '@/components/ui/filled-input';
import { PasswordDialog } from '@/modules/main/settings/reset-password-dialog';
import { Label } from '@/components/ui/label';
import { Avatar } from '@/components/ui/avatar';

// Hooks
import { useSession } from '@/hooks/data/auth';

// Schemas
import { SettingsProfileArgs, settingsSchema } from '@repo/schemas/settings';

// Config
import { withReactQueryProvider } from '@/config/react-query';

export const PersonalInformationForm = withReactQueryProvider(() => {
	const { control, watch } = useForm<SettingsProfileArgs>({
		resolver: zodResolver(settingsSchema),
	});

	return (
		<div className="border-input-border mt-10 flex flex-col justify-between gap-8 rounded-md border p-6 lg:p-8 xl:flex-row 2xl:p-10">
			<div>
				<h4 className="text-lg font-semibold">Personal information</h4>
				<p className="text-muted-foreground mt-2">
					More information about you to others
				</p>
			</div>

			<div className="flex flex-col items-center gap-12 xl:flex-row xl:items-center">
				<div className="order-2 flex flex-col gap-6 xl:-order-1"></div>
			</div>
		</div>
	);
});
