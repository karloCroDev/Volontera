'use client';

// External packages
import * as React from 'react';
import { Button as AriaButton, Form } from 'react-aria-components';
import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Modules
import {
	DndMapppingImages,
	ImageItemArgs,
	isLocalImageItem,
} from '@/components/ui/dnd-mapping-images';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Hooks
import { useSession } from '@/hooks/data/user';
import { useCreatePost } from '@/hooks/data/post';

// Schemas
import { createPostSchema, CreatePostArgs } from '@repo/schemas/post';
import { TextEditor } from '@/components/ui/text-editor/text-editor';
import { Error } from '@/components/ui/error';

// Lib
import { convertToFullname } from '@/lib/utils/converter';
import { toast } from '@/lib/utils/toast';

export const CreatePostDialog = () => {
	const [isOpen, setIsOpen] = React.useState(false);

	const [images, setImages] = React.useState<ImageItemArgs>([]);

	const {
		handleSubmit,
		formState: { errors },
		control,
		setError,
		setValue,
		reset,
	} = useForm<Omit<CreatePostArgs, 'organizationId'>>({
		resolver: zodResolver(createPostSchema.omit({ organizationId: true })),
		defaultValues: {
			title: '',
			content: '',
			images: [],
		},
	});

	const params = useParams<{ organizationId: string }>();
	const { mutate, isPending } = useCreatePost(params.organizationId);

	React.useEffect(() => {
		const localImages = images.filter(isLocalImageItem);
		setValue(
			'images',
			localImages.map(({ contentType, filename, size }) => ({
				contentType,
				filename,
				size,
			})),
			{
				shouldDirty: true,
				shouldTouch: true,
				shouldValidate: true,
			}
		);
	}, [images, setValue]);

	const onSubmit = (data: Omit<CreatePostArgs, 'organizationId'>) => {
		const localImages = images.filter(isLocalImageItem);

		mutate(
			{
				data: {
					...data,
					organizationId: params.organizationId,
				},
				files: localImages.map((img) => img.file),
			},
			{
				onSuccess: ({ message, title }) => {
					setImages([]);
					setIsOpen(false);
					toast({
						title: title,
						content: message,
						variant: 'success',
					});
					reset();
				},
				onError: (err: { message: string }) => {
					setError('root', { message: err.message });
				},
			}
		);
	};

	const { data: user } = useSession();

	return (
		<Dialog
			isOpen={isOpen}
			onOpenChange={setIsOpen}
			triggerChildren={
				<AriaButton className="border-input-border flex w-full items-center gap-4 rounded-2xl border p-5 outline-none">
					<Avatar
						imageProps={{
							src: user?.image || undefined,
						}}
						colorScheme="gray"
						size="md"
					>
						{convertToFullname({
							firstname: user?.firstName || '',
							lastname: user?.lastName || '',
						})}
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
			<Form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
				<div>
					<Label>Title</Label>
					<Controller
						control={control}
						name="title"
						render={({ field }) => (
							<Input
								label="Enter your post title"
								className="mt-2"
								inputProps={field}
								error={errors.title?.message}
							/>
						)}
					/>
				</div>

				<div>
					<Label>Content</Label>
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
						<Label className="mb-2">Post image(s)</Label>
						<DndMapppingImages
							images={images}
							setImages={(next) => {
								setImages((prev) =>
									typeof next === 'function' ? next(prev) : next
								);
							}}
						/>
						{errors.images?.message && (
							<p className="text-destructive mt-2 text-sm">
								{errors.images.message}
							</p>
						)}
					</div>

					<Button
						type="submit"
						className="ml-auto"
						isLoading={isPending}
						isDisabled={isPending}
					>
						Submit
					</Button>
				</div>

				{errors.root?.message && <Error>{errors.root.message}</Error>}
			</Form>
		</Dialog>
	);
};
