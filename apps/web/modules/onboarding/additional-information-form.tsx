'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';
import { ArrowRight } from 'lucide-react';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePciker } from '@/components/ui/date-picker';

export const AdditionalInformationForm = () => {
	const hasUserInput = false;

	return (
		<Form className="mt-20 flex flex-col items-center gap-6 lg:gap-8">
			<Avatar
				imageProps={{
					src: '',
					alt: 'Avatar',
				}}
				size="full"
				isInput
			>
				Karlo Grgic
			</Avatar>

			<div className="w-full">
				<Label isOptional>DOB</Label>
				<DatePciker className="mt-2" />
			</div>
			<div className="w-full">
				<Label htmlFor="DOB" isOptional>
					Bio
				</Label>
				<Textarea id="DOB" label="Enter your bio..." className="mt-2" />
			</div>
			<Button
				className="w-full"
				size="lg"
				iconRight={!hasUserInput && <ArrowRight />}
				colorScheme={hasUserInput ? 'orange' : 'bland'}
			>
				{!hasUserInput ? 'Skip' : 'Finish'}
			</Button>
		</Form>
	);
};
