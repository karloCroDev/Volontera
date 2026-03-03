'use client';

// External packages
import * as React from 'react';
import { MessageCircle, Mic, PhoneOff, RefreshCcw, Video } from 'lucide-react';

/// Components
import { Button } from '@/components/ui/button';

// Lib
import { useChat } from '@/modules/main/organization/video-meeting/chat-provider';

export const VideoOptions = () => {
	const { setIsChatOpen, isChatOpen } = useChat();

	return (
		<div className="border-input-border bg-muted flex items-center gap-3 rounded-full border px-4 py-2">
			<Button variant="ghost" className="p-2" isFullyRounded>
				<Mic />
			</Button>

			<Button
				variant={isChatOpen ? 'outline' : 'ghost'}
				className="p-2"
				isFullyRounded
				onPress={() => setIsChatOpen((prev) => !prev)}
			>
				<MessageCircle />
			</Button>

			<Button variant="ghost" className="p-2" isFullyRounded>
				<Video />
				{/* <VideoOff /> */}
			</Button>

			{/* display only when video is not turned off */}
			<Button variant="ghost" className="p-2" isFullyRounded>
				<RefreshCcw />
			</Button>

			<hr className="bg-input-border h-10 w-px border-0" />
			<Button
				className="bg-destructive hover:bg-destructive p-2 text-white"
				isFullyRounded
			>
				<PhoneOff />
			</Button>
		</div>
	);
};
