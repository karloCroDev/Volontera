'use client';

// External packages
import { Heart } from 'lucide-react';
import * as React from 'react';

export const PostLike = () => {
	return (
		<div className="ml-auto flex items-center gap-4">
			<Heart
				//  fill="#f59f0a" className="text-primary"
				className="text-background-foreground cursor-pointer"
			/>
			<p className="font-semibold italic underline underline-offset-4">100</p>
		</div>
	);
};
