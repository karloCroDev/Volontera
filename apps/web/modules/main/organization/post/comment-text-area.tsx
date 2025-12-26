'use client';

// External packages
import * as React from 'react';
import { Plus, Send } from 'lucide-react';

// Components
import { ResizableTextArea } from '@/components/ui/resizable-input';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// Hooks
import { useSession } from '@/hooks/data/user';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { convertToFullname } from '@/lib/utils/convert-to-fullname';

export const CommentTextArea = withReactQueryProvider(() => {
	const { data: user } = useSession();

	return (
		<ResizableTextArea
			label="Enter your message"
			className="border-input-border mt-12 gap-4 border"
			iconsLeft={
				user && (
					<Avatar
						imageProps={{
							src: user?.image || '',
						}}
						size="sm"
						colorScheme="gray"
						className="mt-4 self-start"
					>
						{convertToFullname({
							firstname: user.firstName,
							lastname: user.lastName,
						})}
					</Avatar>
				)
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
