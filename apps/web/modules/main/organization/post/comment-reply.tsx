// External packages
import { Collapsible } from '@/components/ui/collapsible';
import { Tag } from '@/components/ui/tag';
import { ChevronRight } from 'lucide-react';
import * as React from 'react';

export const CommentReply = () => {
	return (
		<div className="mt-4">
			<Collapsible
				contentProps={{
					children: <div>Example</div>,
				}}
				trigger={
					<div className="group">
						<Tag className="flex items-center gap-4">
							See 135 replies{' '}
							<ChevronRight className="size-4 transition-transform group-data-[state=open]:-rotate-90" />
						</Tag>
					</div>
				}
			></Collapsible>
		</div>
	);
};
