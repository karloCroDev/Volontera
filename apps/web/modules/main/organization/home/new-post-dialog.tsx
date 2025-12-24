'use client';

// External packages
import * as React from 'react';
import { Button as AriaButton, Form } from 'react-aria-components';
import { Plus } from 'lucide-react';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Modules
import { DndMapppingImages } from '@/modules/main/organization/home/dnd-mapping-images';

export const NewPostDialog = () => {
	return (
		<Dialog
			triggerChildren={
				<AriaButton className="border-input-border mb-6 flex w-full items-center gap-4 rounded-2xl border p-5 outline-none">
					<Avatar
						imageProps={{
							src: '',
						}}
						colorScheme="gray"
						size="md"
					>
						Admin Name
					</Avatar>
					<p className="text-md text-muted-foreground font-medium">
						Add new post
					</p>

					<Plus className="text-muted-foreground ml-auto size-8" />
				</AriaButton>
			}
			title="Create new post"
			subtitle="Let's create new post for your organization"
		>
			<Form className="flex flex-col gap-4">
				<div>
					<Label>Title</Label>
					<Input label="Enter your post title" className="mt-2" />
				</div>

				<div>
					<Label>Content</Label>
					<Textarea label="Enter your post content" className="mt-2" />
				</div>

				<div className="flex items-end gap-4">
					<div className="flex-1">
						<Label className="mb-2">Post image(s)</Label>
						<DndMapppingImages />
					</div>

					<Button type="submit" className="ml-auto">
						{' '}
						Submit
					</Button>
				</div>
			</Form>
		</Dialog>
	);
};
