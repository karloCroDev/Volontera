'use client';

// External packages
import * as React from 'react';
import { X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

// Components
import { Button } from '@/components/ui/button';

// Modules
import { useMessagesReply } from '@/components/ui/message/reply-context';

export const ReplyIndicator: React.FC<
	React.ComponentPropsWithoutRef<'div'>
> = ({ className, ...rest }) => {
	const { replyingTo, setReplyingTo } = useMessagesReply();

	if (!replyingTo) {
		return null;
	}

	return (
		<div
			{...rest}
			className={twMerge(
				'border-input-border bg-muted mb-3 flex items-center justify-between rounded-md border p-2',
				className
			)}
		>
			<div className="flex-1">
				<p className="text-muted-foreground text-xs font-semibold">
					Replying to
				</p>
				<p className="truncate text-xs">
					{replyingTo.content.length > 50
						? replyingTo.content.slice(0, 50) + '...'
						: replyingTo.content}
				</p>
			</div>
			<Button
				type="button"
				onPress={() => setReplyingTo(null)}
				className="text-muted-foreground hover:text-foreground ml-2 flex-shrink-0"
				variant="blank"
			>
				<X size={16} />
			</Button>
		</div>
	);
};
