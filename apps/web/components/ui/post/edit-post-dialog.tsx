'use client';

// External packages
import * as React from 'react';
import { EllipsisVertical } from 'lucide-react';
import { Form } from 'react-aria-components';
import { Controller, useForm } from 'react-hook-form';

// Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { FilledInput } from '@/components/ui/filled-input';
import { TextEditor } from '@/components/ui/text-editor/text-editor';
import {
	DndMapppingImages,
	ImageItemArgs,
	isLocalImageItem,
} from '@/components/ui/dnd-mapping-images';

// Schemas
import { UpdatePostArgs, updatePostSchema } from '@repo/schemas/post';

// Hooks
import { useRetrievePostData, useUpadatePost } from '@/hooks/data/post';
import { useGetImageFromKeys } from '@/hooks/data/image';
import { useRouter } from 'next/navigation';
import { toast } from '@/lib/utils/toast';
import { zodResolver } from '@hookform/resolvers/zod';

export const EditPostDialog: React.FC<{
	postId: string;
	organizationId: string;
}> = ({ postId, organizationId }) => {
	const [images, setImages] = React.useState<ImageItemArgs>([]);
	const { data } = useRetrievePostData(postId);

	const { data: image } = useGetImageFromKeys({
		imageUrls: data?.post.postImages.map((image) => image.imageUrl) || [],
	});

	const {
		control,
		reset,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<UpdatePostArgs>({
		resolver: zodResolver(updatePostSchema),
		defaultValues: {
			title: '',
			content: '',
			images: [],
			organizationId,
		},
	});

	React.useEffect(() => {
		const localImages = images.filter(isLocalImageItem);
		setValue(
			'images',
			localImages.map((img) => ({
				filename: img.filename,
				contentType: img.contentType,
				size: img.size,
			})),
			{ shouldDirty: true, shouldValidate: true }
		);
	}, [images, setValue]);

	React.useEffect(() => {
		if (data && image) {
			setImages(
				data.post.postImages.flatMap((img) => {
					const resolvedUrl = image.urls[img.imageUrl];
					if (!resolvedUrl) return [];
					return [
						{
							id: img.id,
							kind: 'remote',
							previewUrl: resolvedUrl,
							imageUrl: img.imageUrl,
						},
					];
				})
			);
			reset({
				title: data.post.title,
				content: data.post.content,
				organizationId: data.post.organizationId,

				images: data.post.postImages.map((img) => img.imageUrl),
			});
		}
	}, [data, image, reset]);

	const { mutate, isPending } = useUpadatePost();

	const router = useRouter();
	const onSubmit = (data: UpdatePostArgs) => {
		mutate(
			{
				data: {
					...data,
					organizationId,
					images: images
						.map((img) => {
							if (isLocalImageItem(img)) {
								return {
									filename: img.filename,
									contentType: img.contentType,
									size: img.size,
								};
							}
							return img.imageUrl;
						})
						.filter((img) => img !== undefined),

					postId,
				},
				files: images
					.filter((img) => img.kind === 'local')
					.map((img) => img.file),
			},
			{
				onSuccess: ({ title, message }) => {
					toast({
						title,
						content: message,
						variant: 'success',
					});
					router.push(`/organization/post/${postId}`);
				},
			}
		);
	};

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

					<Controller
						control={control}
						name="title"
						render={({ field }) => (
							<FilledInput
								placeholderValue="Title"
								inputProps={field}
								className="mt-2"
							/>
						)}
					/>
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

					<Button
						type="submit"
						className="ml-auto"
						isLoading={isPending}
						isPending={isPending}
					>
						Submit
					</Button>
				</div>
			</Form>
		</Dialog>
	);
};
