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
import { convertToFullname } from '@/lib/utils/convert-to-fullname';
import { toast } from '@/lib/utils/toast';

export const NewPostDialog = () => {
	const [isOpen, setIsOpen] = React.useState(false);

	const [images, setImages] = React.useState<ImageItemArgs>([]);
	const params = useParams<{ organizationId: string }>();
	const createPostFormSchema = React.useMemo(
		() => createPostSchema.omit({ organizationId: true }),
		[]
	);

	const {
		handleSubmit,
		formState: { errors },
		control,
		setError,
		setValue,
		reset,
	} = useForm<Omit<CreatePostArgs, 'organizationId'>>({
		resolver: zodResolver(createPostFormSchema),
		defaultValues: {
			title: '',
			content: '',
			images: [],
		},
	});

	React.useEffect(() => {
		setValue(
			'images',
			images.map((img) => ({
				filename: img.filename,
				contentType: img.contentType,
				size: img.size,
			})),
			{ shouldDirty: true, shouldValidate: true }
		);
	}, [images, setValue]);

	const { mutate, isPending } = useCreatePost();

	const onSubmit = (data: Omit<CreatePostArgs, 'organizationId'>) => {
		mutate(
			{
				data: {
					...data,
					organizationId: params.organizationId,
					images: images.map(({ contentType, filename, size }) => ({
						contentType,
						filename,
						size,
					})),
				},
				files: images.map((img) => img.file),
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
				},
				onError: (err: { message: string }) => {
					setError('root', { message: err.message });
				},
				onSettled: () => {
					reset();
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
				<AriaButton className="border-input-border mb-6 flex w-full items-center gap-4 rounded-2xl border p-5 outline-none">
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
						<DndMapppingImages images={images} setImages={setImages} />
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
