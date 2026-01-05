'use client';

// External packages
import * as React from 'react';
import { Heart } from 'lucide-react';

// Hooks
import { useToggleLike } from '@/hooks/data/post';
import { Button } from '@/components/ui/button';
import { twJoin } from 'tailwind-merge';

export const PostLike: React.FC<{ count: number; hasUserLiked: boolean }> = ({
	count,
	hasUserLiked,
}) => {
	const { mutate } = useToggleLike();

	return (
		<div className="ml-auto flex items-center gap-4">
			<Button variant="blank" onPress={() => {}}>
				<Heart
					fill="#f59f0a"
					className={twJoin(
						'cursor-pointer',
						hasUserLiked ? 'text-primary' : 'text-background-foreground'
					)}
				/>
			</Button>
			<p className="font-semibold italic underline underline-offset-4">
				{count}
			</p>
		</div>
	);
};
