'use client';

// External packages
import * as React from 'react';
import { Camera, X } from 'lucide-react';
import Image from 'next/image';
import { Input as AriaInput } from 'react-aria-components';
import { Button } from '@/components/ui/button';

export const InsertPhoto: React.FC<
	React.ComponentPropsWithoutRef<'label'> & {
		// TODO: Just set this to be required
		inputProps?: React.ComponentPropsWithoutRef<'input'>;
		isRequired?: boolean;
	}
> = ({ children, htmlFor, isRequired = false, inputProps, ...rest }) => {
	const [image, setImage] = React.useState<File | null>(null);

	return (
		<>
			<label
				{...rest}
				htmlFor={htmlFor}
				className="border-input-border text-muted-foreground relative flex min-h-96 flex-1 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed px-4"
			>
				{image ? (
					<>
						<Button
							className="absolute right-2 top-2 z-20 p-1"
							isFullyRounded
							colorScheme="destructive"
							onPress={() => setImage(null)}
						>
							<X className="size-4" />
						</Button>
						<Image
							src={URL.createObjectURL(image)}
							alt="Avatar"
							className="object-cover"
							fill
						/>
					</>
				) : (
					<>
						<Camera />
						<p className="text-center">{children}</p>
						<p>({isRequired ? 'required' : 'optional'})</p>
					</>
				)}
			</label>
			<AriaInput
				{...inputProps}
				onChange={(e) => {
					const file = e.target.files?.[0] || null;

					if (!file) return;
					setImage(file);
				}}
				id={htmlFor}
				type="file"
				accept="image/*"
				multiple
				className="sr-only"
			/>
		</>
	);
};
