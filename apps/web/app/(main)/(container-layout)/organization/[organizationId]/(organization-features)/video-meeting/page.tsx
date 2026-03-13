// External packages
import { Volume2 } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { ChatWindow } from '@/modules/main/organization/video-meeting/chat-window';
import { ChatProvider } from '@/modules/main/organization/video-meeting/chat-provider';
import { VideoOptions } from '@/modules/main/organization/video-meeting/video-options';

export default async function VideoMeetingPage() {
	return (
		<ChatProvider>
			<div className="flex h-full flex-col gap-4">
				<div className="border-input-border relative flex-1 rounded-lg border shadow-lg">
					<div className="absolute bottom-4 left-4">
						{/* add slider for audio */}
						<Button variant="ghost" className="p-2" isFullyRounded>
							<Volume2 />
						</Button>
					</div>

					<ChatWindow />
				</div>

				<div className="flex h-20 gap-4 overflow-x-scroll">
					<div className="flex flex-1 gap-4">
						<div className="border-input-border relative size-20 rounded border shadow-lg"></div>
					</div>

					<hr className="bg-input-border h-full w-px border-0" />

					<VideoOptions />
				</div>
			</div>
		</ChatProvider>
	);
}
