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
import {
	DndMapppingImages,
	ImageItemArgs,
} from '@/components/ui/dnd-mapping-images';
import { Controller, useForm } from 'react-hook-form';
import { UpdatePostArgs, updatePostSchema } from '@repo/schemas/post';
import { TextEditor } from '@/components/ui/text-editor/text-editor';

export const EditPostDialog = () => {
	const [images, setImages] = React.useState<ImageItemArgs>([]);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<UpdatePostArgs>({
		context: updatePostSchema,
		defaultValues: {
			title: '',
			content: '',
			images: [],
		},
	});

	React.useEffect(() => {}, []);

	const onSubmit = (data: UpdatePostArgs) => {};

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
			<Form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
				<div>
					<Label isOptional>Title</Label>
					<FilledInput placeholderValue="Woah" className="mt-2" />
				</div>

				<div>
					<Label isOptional>Content</Label>
					<Controller
						control={control}
						name="content"
						render={({ field }) => (
							<TextEditor
								className="mt-2"
								label="Enter your post content"
								value={field.value}
								setValue={(next) => {
									const nextValue =
										typeof next === 'function' ? next(field.value) : next;
									field.onChange(nextValue);
								}}
								error={errors.content?.message}
							/>
						)}
					/>
				</div>

				<div className="flex items-end gap-4">
					<div className="flex-1">
						<Label className="mb-2">Manage images</Label>
						<DndMapppingImages images={images} setImages={setImages} />
					</div>

					<Button type="submit" className="ml-auto">
						Submit
					</Button>
				</div>
			</Form>
		</Dialog>
	);
};
