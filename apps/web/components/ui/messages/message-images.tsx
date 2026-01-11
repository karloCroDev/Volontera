'use client';

// External packages
import * as React from 'react';
import Image from 'next/image';

// Components
import { Carousel } from '@/components/ui/carousel';

// Hooks
import { useGetImageFromKeys } from '@/hooks/data/image';

export const MessageImages: React.FC<{
	imageUrls: string[];
}> = ({ imageUrls }) => {
	const { data: images, isPending } = useGetImageFromKeys({
		imageUrls,
	});

	return (
		<div className="border-input-border relative size-80 overflow-hidden rounded-lg border-2">
			{isPending && (
				<div className="bg-muted-foreground text-muted-foreground h-full w-full animate-pulse" />
			)}

			{imageUrls.length > 1 ? (
				<Carousel
					slides={imageUrls.map((imageUrl, id) => {
						const src = images?.urls?.[imageUrl];
						if (!src) return null;

						return (
							<div
								key={id}
								className="relative flex size-80 overflow-hidden rounded-md"
							>
								<Image
									src={src}
									alt="Message Image"
									fill
									className="object-cover"
								/>
							</div>
						);
					})}
				/>
			) : (
				imageUrls.length === 1 && (
					<Image
						src={images?.urls[imageUrls[0]!] || ''}
						alt="Message Image"
						fill
						className="object-cover"
					/>
				)
			)}
		</div>
	);
};
