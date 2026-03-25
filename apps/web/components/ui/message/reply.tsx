'use client';

// External packages
import { Quote } from 'lucide-react';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';
import { Reply as ReplyIcon } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { VariantProps } from '@/components/ui/message/message';

export const Reply: React.FC<{
	reply: string;
	variant: VariantProps;
}> = ({ reply, variant }) => {
	return (
		<div
			className={twMerge(
				'text-muted-foreground md:max-w-3/5 w-4/5" border-input-border mt-6 flex items-baseline gap-4 rounded-lg border p-3',
				variant === 'primary' && 'ml-auto'
			)}
		>
			<Quote />
			<p className="text-xs">
				{reply} Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque
				nam laudantium aperiam iusto tenetur porro id modi quibusdam odio
				nesciunt adipisci quisquam corrupti incidunt necessitatibus repellendus,
				reprehenderit voluptatum pariatur mollitia? Lorem ipsum dolor sit amet
				consectetur adipisicing elit. Temporibus adipisci, consequuntur
				sapiente, minima voluptate rem facilis a inventore modi minus laboriosam
				saepe, sint incidunt quidem deserunt nesciunt? Obcaecati, deserunt
				consequatur.
			</p>
			<Quote />
		</div>
	);
};

export const ReplyButton: React.FC<{ onPress?: () => void }> = ({
	onPress,
}) => {
	return (
		<Button
			variant="blank"
			size="xs"
			className={
				'text-muted-foreground mt-auto cursor-pointer opacity-0 transition-all group-hover:opacity-100'
			}
			onPress={onPress}
		>
			<ReplyIcon />
		</Button>
	);
};
