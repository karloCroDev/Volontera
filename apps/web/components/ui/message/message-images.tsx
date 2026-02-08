'use client';

// External packages
import * as React from 'react';
import Image from 'next/image';

// Components
import { Carousel } from '@/components/ui/carousel';

export const MessageImages: React.FC<{
	imageUrls: string[];
}> = ({ imageUrls }) => {
	if (!imageUrls || imageUrls.length === 0) return null;

	return (
		<div className="border-input-border relative size-80 overflow-hidden rounded-lg border-2">
			{imageUrls.length > 1 ? (
				<Carousel
					slides={imageUrls.map((src, id) => (
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
					))}
				/>
			) : (
				<Image
					src={imageUrls[0]!}
					alt="Message Image"
					fill
					className="object-cover"
				/>
			)}
		</div>
	);
};
