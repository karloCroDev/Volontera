'use client';

// External packages
import * as React from 'react';
import { EllipsisVertical } from 'lucide-react';
import { Form } from 'react-aria-components';

// Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FilledInput } from '@/components/ui/filled-input';

// Modules
import { DndMapppingImages } from '@/modules/main/organization/home/dnd-mapping-images';

export const EditPost = () => {
	return (
		<Dialog
			title="Edit post"
			subtitle="Change title, images or descirption of your post"
			triggerChildren={
				<Button variant="blank">
					<EllipsisVertical className="text-muted-foreground" />
				</Button>
			}
		>
			<Form className="flex flex-col gap-4">
				<div>
					<Label isOptional>Title</Label>
					<FilledInput placeholderValue="Woah" className="mt-2" />
				</div>

				<div>
					<Label isOptional>Content</Label>
					<Textarea label="Your content" className="mt-2" />
				</div>

				<div className="flex items-end gap-4">
					<div className="flex-1">
						<Label className="mb-2">Manage images</Label>
						<DndMapppingImages />
					</div>

					<Button type="submit" className="ml-auto">
						Submit
					</Button>
				</div>
			</Form>
		</Dialog>
	);
};
