'use client';

// External packages
import * as React from 'react';

// Modules
import { Comment } from '@/modules/main/organization/post/comment';

export const CommentsMapping = () => {
	return [...Array(8)].map((_, indx) => (
		<div key={indx} className="no-scrollbar mt-4 max-h-[600px] overflow-scroll">
			<Comment
				commentId={indx.toString()}
				numberOfLikes={10}
				numberOfReplies={12}
				comment={'Awesome stuff'}
			/>
		</div>
	));
};
