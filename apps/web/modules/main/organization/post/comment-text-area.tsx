'use client';

// External packages
import * as React from 'react';

// Components
import { ResizableTextArea } from '@/components/ui/resizable-input';
import { Avatar } from '@/components/ui/avatar';
import { useSession } from '@/hooks/data/auth';
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const CommentTextArea = withReactQueryProvider(() => {
	const { data: user } = useSession();

	return (
		<ResizableTextArea
			label="Enter your message"
			className="border-input-border gap-4 border"
			iconsLeft={
				<Avatar
					imageProps={{
						src: user?.image,
					}}
					size="sm"
					variant="secondary"
				>
					{user?.fullname}
				</Avatar>
			}
			iconsRight={
				<Button variant="blank" className="p-0">
					<Plus />
				</Button>
			}
			textAreaProps={{
				className: '!w-full',
			}}
		/>
	);
});
