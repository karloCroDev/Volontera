'use client';

// External packages
import * as React from 'react';
import { Camera, X } from 'lucide-react';
import Image from 'next/image';
import { Input as AriaInput } from 'react-aria-components';

// Components
import { Button } from '@/components/ui/button';
import { twMerge } from 'tailwind-merge';

export const InsertPhoto: React.FC<
	React.ComponentPropsWithoutRef<'label'> & {
		file?: File;
		existingImageSrc?: string;
		isRequired?: boolean;
		onFileChange?: (file?: File) => void;
		isFullyRounded?: boolean;
	}
> = ({
	children,
	htmlFor,
	file,
	existingImageSrc,
	isRequired = true,
	onFileChange,
	isFullyRounded = false,
	className,
	...rest
}) => {
	const [previewUrl, setPreviewUrl] = React.useState<string | undefined>();

	React.useEffect(() => {
		if (!file) {
			setPreviewUrl(undefined);
			return;
		}
		const url = URL.createObjectURL(file);
		setPreviewUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [file]);

	const imageSrc = previewUrl ?? existingImageSrc;

	return (
		<>
			<label
				{...rest}
				htmlFor={htmlFor}
				className={twMerge(
					'border-input-border text-muted-foreground relative flex aspect-[4/3] size-full flex-1 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed px-4',
					className
				)}
			>
				{imageSrc ? (
					<>
						<Button
							className="absolute right-2 top-2 z-20 p-1"
							isFullyRounded
							colorScheme="destructive"
							onPress={() => {
								onFileChange?.(undefined);
							}}
						>
							<X className="size-4" />
						</Button>
						<Image src={imageSrc} alt="Avatar" className="object-cover" fill />
					</>
				) : (
					<>
						<Camera />
						<p className="text-center">{children}</p>
						{isRequired && <p>(required)</p>}
					</>
				)}
			</label>
			<AriaInput
				onChange={(e) => {
					const nextFile = e.target.files?.[0];
					if (!nextFile) return;
					onFileChange?.(nextFile);
				}}
				id={htmlFor}
				type="file"
				accept="image/*"
				className="sr-only"
			/>
		</>
	);
};
