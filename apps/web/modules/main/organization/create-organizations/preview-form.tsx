// External packages
import * as React from 'react';

// Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

export const PreviewForm: React.FC<{
	src: string;
}> = ({ src }) => {
	return (
		<Dialog
			triggerChildren={
				<Button
					variant="ghost"
					size="xs"
					className="lg:text-md text-muted-foreground mb-2"
				>
					Preview
				</Button>
			}
		>
			<iframe
				src={src.includes('embed') ? src : `${src}?embedded=true`}
				className="border-input-border aspect-[4/3] w-full rounded-lg border"
			/>
		</Dialog>
	);
};

/* Link to test
"https://docs.google.com/forms/d/e/1FAIpQLSeJ_PbnTvmK3edUaCQl6QFL7N86EZXnIhCgKEMMRObrbrMxdg/viewform?embedded=true"
*/
