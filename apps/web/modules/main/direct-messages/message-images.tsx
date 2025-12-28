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

	return (
		<div className="border-input-border relative size-80 overflow-hidden rounded-lg border-2">
			{isPending && (
				<div className="bg-muted-foreground text-muted-foreground h-full w-full animate-pulse" />
			)}
			{message.directMessagesImages.length > 1 ? (
				<Carousel
					slides={message.directMessagesImages.map(
						({ imageUrl, id }) =>
							images?.urls?.[imageUrl] && (
								<div
									key={id}
									className="relative flex size-80 overflow-hidden rounded-md"
								>
									<Image
										src={images.urls?.[imageUrl]}
										alt="Message Image"
										fill
										className="object-cover"
									/>
								</div>
							)
					)}
				/>
			) : (
				// Ovo provjeravam u vanjskoj komponenti (kako ne bi bez razloga fethcao slike ako ih nema), ali TypeScript ne prepoznaje da je sigurno paa koristim as cast
				<Image
					src={
						images?.urls?.[
							message.directMessagesImages[0]?.imageUrl as string
						] as string
					}
					alt="Message Image"
					fill
					className="object-cover"
				/>
			)}
		</div>
	);
};
