'use client';

// External packages
import * as React from 'react';

// Components
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Form } from 'react-aria-components';

export const JoinDialog = () => {
	return (
		<Dialog
			triggerChildren={
				<Button colorScheme="orange" size="md">
					Join
				</Button>
			}
			title="Join Organization"
			subtitle="Please write a motivational letter to why you should join the organization"
		>
			<Form className="no-scrollbar flex max-h-[600px] flex-col gap-4 overflow-y-scroll">
				<div>
					<Label className="mb-2">Title</Label>
					<Input label="Enter your post title" />
				</div>
				<div>
					<Label className="mb-2">Motivational Letter</Label>
					<Textarea label="Enter your motivational letter" />
				</div>

				{/* Only if there is a link for google docs! */}
				<div>
					<Label className="mb-4">Additional Information</Label>

					<iframe
						src="https://docs.google.com/forms/d/e/1FAIpQLSeJ_PbnTvmK3edUaCQl6QFL7N86EZXnIhCgKEMMRObrbrMxdg/viewform?embedded=true"
						className="border-input-border h-[400px] w-full rounded-lg border"
					/>
				</div>

				<Button type="submit" className="self-end" size="md">
					Submit
				</Button>
			</Form>
			{/* TODO: Try to embedd a google docs form */}
		</Dialog>
	);
};
