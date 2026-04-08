// External packages
import { Loader2 } from 'lucide-react';
import * as React from 'react';

// Components
import { Container } from '@/components/ui/container';

export const JoiningMeetingOverlay = () => {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm">
			<Container className="border-input-border text-muted-foreground bg-muted flex items-center gap-3 rounded-full px-4 py-3 text-sm shadow-2xl">
				<Loader2 className="size-4 animate-spin" />
				<p>Preparing the meeting room...</p>
			</Container>
		</div>
	);
};
