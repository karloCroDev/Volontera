'use client';

// External packages
import * as React from 'react';
import Image from 'next/image';

// Hooks
import { useGetImageFromKey } from '@/hooks/data/image';

// Types
import { GetDirectMessagesConversationByIdResponse } from '@repo/types/direct-messages';
import { Carousel } from '@/components/ui/carousel';

export const MessageImages: React.FC<{
	messages: GetDirectMessagesConversationByIdResponse['conversation'];
	message: GetDirectMessagesConversationByIdResponse['conversation'][0];
}> = ({ messages, message }) => {
	const { data: images, isPending } = useGetImageFromKey(
		{
			imageUrls:
				messages
					?.map((message) =>
						message.directMessagesImages.map((img) => img.imageUrl)
					)
					.flat() || [],
		},
		{
			enabled: messages && !!messages.length,
		}
	);

	const firstImageKey = message.directMessagesImages[0]!.imageUrl; // Znamo da cemo ga dobiti jer se koristi samo ako postoji barem jedna slika
	const firstImageSrc = firstImageKey
		? images?.urls?.[firstImageKey]
		: undefined;

	return (
		<div className="border-input-border relative size-80 overflow-hidden rounded-lg border-2">
			{isPending && (
				<div className="bg-muted-foreground text-muted-foreground h-full w-full animate-pulse" />
			)}

			{!isPending &&
				(message.directMessagesImages.length > 1 ? (
					<Carousel
						slides={message.directMessagesImages.map(({ imageUrl, id }) => {
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
				) : firstImageSrc ? (
					<Image
						src={firstImageSrc}
						alt="Message Image"
						fill
						className="object-cover"
					/>
				) : null)}
		</div>
	);
};
