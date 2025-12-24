'use client';

// External packages
import * as React from 'react';
import { Share2 } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';

// Lib
import { toast } from '@/lib/utils/toast';

export const SharePost: React.FC<{
	link: string;
}> = ({ link }) => {
	return (
		<Button
			variant="blank"
			className="px-0"
			onPress={() => {
				navigator.clipboard
					.writeText(link)
					.then(() => {
						toast({
							title: 'Link copied',
							content: 'Link is successfully copied, share it to your friends!',
							variant: 'success',
						});
					})
					.catch(() => {
						toast({
							title: "Link isn't copied",
							content: "Link isn't copied please try again",
							variant: 'success',
						});
					});
			}}
		>
			<Share2 className="text-muted-foreground size-5 cursor-pointer" />
		</Button>
	);
};
