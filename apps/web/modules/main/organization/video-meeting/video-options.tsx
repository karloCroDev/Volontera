'use client';

// External packages
import * as React from 'react';
import { MeetingSession } from 'amazon-chime-sdk-js';
import {
	Mic,
	MicOff,
	MonitorUp,
	PhoneOff,
	Video,
	VideoOff,
} from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { useVideoMeetingRoomContext } from '@/modules/main/organization/video-meeting/video-meeting-room-context';

export const VideoOptions = () => {
	const { meetingSession, isLeaving, canShareScreen, handleLeaveMeeting } =
		useVideoMeetingRoomContext();

	const [isMuted, setIsMuted] = React.useState(false);
	const [isCameraOn, setIsCameraOn] = React.useState(false);
	const [isSharingScreen, setIsSharingScreen] = React.useState(false);

	React.useEffect(() => {
		if (!meetingSession) {
			setIsMuted(false);
			setIsCameraOn(false);
			setIsSharingScreen(false);
		}
	}, [meetingSession]);

	const handleToggleMic = React.useCallback(async () => {
		if (!meetingSession) {
			return;
		}

		if (isMuted) {
			meetingSession.audioVideo.realtimeUnmuteLocalAudio();
			setIsMuted(false);
			return;
		}

		meetingSession.audioVideo.realtimeMuteLocalAudio();
		setIsMuted(true);
	}, [isMuted, meetingSession]);

	const handleToggleCamera = React.useCallback(async () => {
		if (!meetingSession) {
			return;
		}

		if (isCameraOn) {
			meetingSession.audioVideo.stopLocalVideoTile();
			setIsCameraOn(false);
			return;
		}

		meetingSession.audioVideo.startLocalVideoTile();
		setIsCameraOn(true);
	}, [isCameraOn, meetingSession]);

	const handleToggleScreenShare = React.useCallback(async () => {
		if (!meetingSession || !canShareScreen) {
			return;
		}

		if (isSharingScreen) {
			meetingSession.audioVideo.stopContentShare();
			setIsSharingScreen(false);
			return;
		}

		await meetingSession.audioVideo.startContentShareFromScreenCapture();
		setIsSharingScreen(true);
	}, [isSharingScreen, canShareScreen, meetingSession]);

	return (
		<div className="border-input-border bg-muted flex items-center gap-3 rounded-full border px-4 py-2">
			<Button
				variant={isMuted ? 'outline' : 'ghost'}
				className="p-2"
				isFullyRounded
				onPress={handleToggleMic}
				isDisabled={!meetingSession}
			>
				{isMuted ? <MicOff /> : <Mic />}
			</Button>

			<Button
				variant={isCameraOn ? 'ghost' : 'outline'}
				className="p-2"
				isFullyRounded
				onPress={handleToggleCamera}
				isDisabled={!meetingSession}
			>
				{isCameraOn ? <Video /> : <VideoOff />}
			</Button>

			{canShareScreen && (
				<Button
					variant={isSharingScreen ? 'outline' : 'ghost'}
					className="p-2"
					isFullyRounded
					onPress={handleToggleScreenShare}
					isDisabled={!meetingSession}
				>
					<MonitorUp />
				</Button>
			)}

			<hr className="bg-input-border h-10 w-px border-0" />
			<Button
				className="bg-destructive hover:bg-destructive p-2 text-white"
				isFullyRounded
				onPress={() => handleLeaveMeeting()}
				isLoading={isLeaving}
			>
				<PhoneOff />
			</Button>
		</div>
	);
};
