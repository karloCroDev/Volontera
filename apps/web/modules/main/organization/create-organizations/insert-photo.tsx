'use client';

// External packages
import * as React from 'react';
import { Camera, X } from 'lucide-react';
import Image from 'next/image';
import { Input as AriaInput } from 'react-aria-components';

// Components
import { Button } from '@/components/ui/button';

export const InsertPhoto: React.FC<
	React.ComponentPropsWithoutRef<'label'> & {
		file?: File;
		onFileChange?: (file?: File) => void;
	}
> = ({ children, htmlFor, file, onFileChange, ...rest }) => {
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

	return (
		<>
			<label
				{...rest}
				htmlFor={htmlFor}
				className="border-input-border text-muted-foreground relative flex min-h-96 flex-1 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed px-4"
			>
				{file && previewUrl ? (
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
						<Image
							src={previewUrl}
							alt="Avatar"
							className="object-cover"
							fill
						/>
					</>
				) : (
					<>
						<Camera />
						<p className="text-center">{children}</p>
						<p>(required)</p>
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
