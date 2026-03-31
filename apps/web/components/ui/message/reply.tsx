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
				'text-muted-foreground md:max-w-3/5 w-4/5" border-input-border mt-6 flex items-baseline gap-2 rounded-lg border p-3',
				variant === 'primary' && 'ml-auto'
			)}
		>
			<Quote className="size-2" />
			<p className="text-xs">{reply}</p>
			<Quote className="size-2" />
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
