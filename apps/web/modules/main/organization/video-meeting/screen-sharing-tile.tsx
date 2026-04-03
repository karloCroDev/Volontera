'use client';

// External packages
import * as React from 'react';
import { MeetingSession, VideoTileState } from 'amazon-chime-sdk-js';

export const ScreenShareTile: React.FC<{
	tileState: VideoTileState;
	meetingSession: MeetingSession | null;
}> = ({ tileState, meetingSession }) => {
	const videoRef = React.useRef<HTMLVideoElement | null>(null);
	const tileId = tileState.tileId;

	React.useEffect(() => {
		if (!meetingSession || tileId == null || !videoRef.current) {
			return;
		}

		meetingSession.audioVideo.bindVideoElement(tileId, videoRef.current);

		return () => {
			// Karlo: Ako bude trebao handleati error
			meetingSession.audioVideo.unbindVideoElement(tileId);
		};
	}, [meetingSession, tileId]);

	return (
		<div className="border-primary/30 relative min-h-[240px] overflow-hidden rounded-3xl border bg-neutral-950 shadow-2xl">
			<video
				ref={videoRef}
				autoPlay
				playsInline
				className="absolute inset-0 size-full object-cover"
			/>

			<div className="bg-background absolute left-4 top-4 rounded-full border px-3 py-1 text-xs">
				Screen share
			</div>
		</div>
	);
};
