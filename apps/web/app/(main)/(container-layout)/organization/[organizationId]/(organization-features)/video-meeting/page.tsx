// External packages
import {
	MessageCircle,
	Mic,
	PhoneOff,
	RefreshCcw,
	Video,
	Volume2,
} from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';

export default async function VideoMeetingPage() {
	return (
		<div className="flex h-full flex-col gap-4">
			<div className="border-input-border relative flex-1 rounded-lg border shadow-lg">
				<div className="absolute bottom-4 left-4">
					{/* add slider for audio */}
					<Button variant="ghost" className="p-2" isFullyRounded>
						<Volume2 />
					</Button>
				</div>
			</div>

			<div className="flex h-20 gap-4 overflow-x-scroll">
				<div className="flex flex-1 gap-4">
					<div className="border-input-border relative size-20 rounded border shadow-lg"></div>
				</div>

				<hr className="bg-input-border h-full w-px border-0" />

				<div className="border-input-border bg-muted flex items-center gap-3 rounded-full border px-4 py-2">
					<Button variant="ghost" className="p-2" isFullyRounded>
						<Mic />
					</Button>
					<Button variant="ghost" className="p-2" isFullyRounded>
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
					<Button
						className="bg-destructive hover:bg-destructive p-2 text-white"
						isFullyRounded
					>
						<PhoneOff />
					</Button>
				</div>
			</div>
		</div>
	);
}
