'use client';

// External packages
import * as React from 'react';

// Components
import { ResizableTextArea } from '@/components/ui/resizable-input';
import { Avatar } from '@/components/ui/avatar';
import { useSession } from '@/hooks/data/auth';
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Send } from 'lucide-react';

export const CommentTextArea = withReactQueryProvider(() => {
	const { data: user } = useSession();

	return (
		<ResizableTextArea
			label="Enter your message"
			className="border-input-border mt-12 gap-4 border"
			iconsLeft={
				<Avatar
					imageProps={{
						src: user?.image,
					}}
					size="sm"
					variant="secondary"
					className="mt-4 self-start"
				>
					{user?.fullname}
				</Avatar>
			}
			iconsRight={
				<>
					<Button variant="blank" className="mt-4 p-2" size="sm">
						<Plus />
					</Button>
					<Button
						variant="outline"
						colorScheme="yellow"
						className="mt-4 p-2"
						size="sm"
					>
						<Send />
					</Button>
				</>
			}
		/>
	);
});
