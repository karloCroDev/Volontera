'use client';

// External packages
import * as React from 'react';
import { Input as AriaInput } from 'react-aria-components';
import { Plus, X } from 'lucide-react';
import Image from 'next/image';

// Components
import { Button } from '@/components/ui/button';
import { twMerge } from 'tailwind-merge';
import { UploadImageArgs } from '@repo/schemas/image';

export type LocalImageItemArgs = UploadImageArgs['image'] & {
	id: string;
	kind: 'local';
	file: File;
	previewUrl: string;
};

export type RemoteImageItemArgs = {
	id: string;
	kind: 'remote';
	previewUrl: string;
	/** Original key/reference if you need to send it back to the API */
	imageUrl?: string;
};

export type ImageItemArgs = (LocalImageItemArgs | RemoteImageItemArgs)[];

export const isLocalImageItem = (item: ImageItemArgs[number]) =>
	item.kind === 'local';

// Logika za premještanje elemenata u nizu
const moveItem = <T,>(items: T[], fromIndex: number, toIndex: number) => {
	if (fromIndex === toIndex) return items;
	const next = items.slice();
	const [moved] = next.splice(fromIndex, 1);
	if (moved === undefined) return items;
	next.splice(toIndex, 0, moved);
	return next;
};

export const DndMapppingImages: React.FC<
	React.ComponentPropsWithoutRef<'div'> & {
		setImages: React.Dispatch<React.SetStateAction<ImageItemArgs>>;
		images: ImageItemArgs;
	}
> = ({ setImages, images, className, ...rest }) => {
	// Sve slike
	const dragFromIdRef = React.useRef<string | null>(null);
	const [dragOverId, setDragOverId] = React.useState<string | null>(null);
	const imagesRef = React.useRef<ImageItemArgs>([]);
	const inputId = React.useId();

	React.useEffect(() => {
		imagesRef.current = images;
	}, [images]);

	React.useEffect(() => {
		return () => {
			imagesRef.current.forEach((img) => {
				if (img.kind === 'local') URL.revokeObjectURL(img.previewUrl);
			});
		};
	}, []);

	const removeImage = React.useCallback(
		(id: string) => {
			setImages((prev) => {
				// Maknem sliku od url
				const toRemove = prev.find((x) => x.id === id);
				// Ovo samo makne sliku iz memorije browsera
				if (toRemove?.kind === 'local')
					URL.revokeObjectURL(toRemove.previewUrl);
				return prev.filter((x) => x.id !== id);
			});
		},
		[setImages]
	);

	const reorderImages = React.useCallback(
		(fromId: string, toId: string) => {
			setImages((prev) => {
				const fromIndex = prev.findIndex((x) => x.id === fromId);
				const toIndex = prev.findIndex((x) => x.id === toId);
				if (fromIndex === -1 || toIndex === -1) return prev;
				return moveItem(prev, fromIndex, toIndex);
			});
		},
		[setImages]
	);
	return (
		<div {...rest} className={twMerge('flex flex-wrap gap-4', className)}>
			{images
				.filter((image) => Boolean(image.previewUrl))
				.map((image) => (
					<div
						key={image.id}
						draggable
						onDragStart={(e) => {
							dragFromIdRef.current = image.id;
							setDragOverId(null);

							e.dataTransfer.setData('text/plain', image.id);

							e.dataTransfer.effectAllowed = 'move';
						}}
						onDragOver={(e) => {
							e.preventDefault();
							if (dragOverId !== image.id) setDragOverId(image.id);
							e.dataTransfer.dropEffect = 'move';
						}}
						onDragLeave={() => {
							setDragOverId((prev) => (prev === image.id ? null : prev));
						}}
						onDrop={(e) => {
							e.preventDefault();
							const fromId =
								dragFromIdRef.current ?? e.dataTransfer.getData('text/plain');
							if (!fromId) return;
							reorderImages(fromId, image.id);
							setDragOverId(null);
							dragFromIdRef.current = null;
						}}
						onDragEnd={() => {
							setDragOverId(null);
							dragFromIdRef.current = null;
						}}
						className={
							'size-30 border-input-border relative overflow-hidden rounded-lg border' +
							(dragOverId === image.id ? ' border-primary' : '')
						}
					>
						<Image
							src={image.previewUrl}
							alt="Image preview"
							fill
							className="object-cover"
						/>

						<Button
							className="absolute right-2 top-2 p-1"
							isFullyRounded
							colorScheme="destructive"
							onPress={() => removeImage(image.id)}
						>
							<X className="size-4" />
						</Button>
					</div>
				))}
			<label
				htmlFor={inputId}
				className="border-input-border hover:border-primary size-30 text-muted-foreground hover:text-primary flex cursor-pointer items-center justify-center gap-4 rounded-lg border border-dashed transition-colors"
			>
				<p>Image</p>
				<Plus />
			</label>
			<AriaInput
				type="file"
				accept="image/*"
				id={inputId}
				multiple
				className="sr-only"
				onChange={(e) => {
					const files = e.target?.files;

					if (!files) return;
					setImages((prev) => {
						const baseIndex = prev.length;
						const nextItems: ImageItemArgs = Array.from(files).map(
							(file, indx) => {
								return {
									id: (baseIndex + indx).toString(),
									kind: 'local',
									contentType: file.type,
									filename: file.name,
									size: file.size,
									file,
									previewUrl: URL.createObjectURL(file),
								};
							}
						);
						return [...prev, ...nextItems];
					});
					e.target.value = '';
				}}
			/>
		</div>
	);
};
