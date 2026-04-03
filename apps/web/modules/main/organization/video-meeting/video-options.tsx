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

type VideoOptionsProps = {
	meetingSession: MeetingSession | null;
	canShareScreen: boolean;
	isLeaving: boolean;
	onLeave: () => Promise<void>;
};

export const VideoOptions = (props: VideoOptionsProps) => {
	const [isMuted, setIsMuted] = React.useState(false);
	const [isCameraOn, setIsCameraOn] = React.useState(false);
	const [isSharingScreen, setIsSharingScreen] = React.useState(false);

	React.useEffect(() => {
		if (!props.meetingSession) {
			setIsMuted(false);
			setIsCameraOn(false);
			setIsSharingScreen(false);
		}
	}, [props.meetingSession]);

	const handleToggleMic = React.useCallback(async () => {
		if (!props.meetingSession) {
			return;
		}

		if (isMuted) {
			props.meetingSession.audioVideo.realtimeUnmuteLocalAudio();
			setIsMuted(false);
			return;
		}

		props.meetingSession.audioVideo.realtimeMuteLocalAudio();
		setIsMuted(true);
	}, [isMuted, props.meetingSession]);

	const handleToggleCamera = React.useCallback(async () => {
		if (!props.meetingSession) {
			return;
		}

		if (isCameraOn) {
			props.meetingSession.audioVideo.stopLocalVideoTile();
			setIsCameraOn(false);
			return;
		}

		try {
			await props.meetingSession.audioVideo.startLocalVideoTile();
			setIsCameraOn(true);
		} catch {
			setIsCameraOn(false);
		}
	}, [isCameraOn, props.meetingSession]);

	const handleToggleScreenShare = React.useCallback(async () => {
		if (!props.meetingSession || !props.canShareScreen) {
			return;
		}

		if (isSharingScreen) {
			props.meetingSession.audioVideo.stopContentShare();
			setIsSharingScreen(false);
			return;
		}

		await props.meetingSession.audioVideo.startContentShareFromScreenCapture();
		setIsSharingScreen(true);
	}, [isSharingScreen, props.canShareScreen, props.meetingSession]);

	return (
		<div className="border-input-border bg-muted flex items-center gap-3 rounded-full border px-4 py-2">
			<Button
				variant={isMuted ? 'outline' : 'ghost'}
				className="p-2"
				isFullyRounded
				onPress={handleToggleMic}
				isDisabled={!props.meetingSession}
			>
				{isMuted ? <MicOff /> : <Mic />}
			</Button>

			<Button
				variant={isCameraOn ? 'ghost' : 'outline'}
				className="p-2"
				isFullyRounded
				onPress={handleToggleCamera}
				isDisabled={!props.meetingSession}
			>
				{isCameraOn ? <Video /> : <VideoOff />}
			</Button>

			{props.canShareScreen && (
				<Button
					variant={isSharingScreen ? 'outline' : 'ghost'}
					className="p-2"
					isFullyRounded
					onPress={handleToggleScreenShare}
					isDisabled={!props.meetingSession}
				>
					<MonitorUp />
				</Button>
			)}

			<hr className="bg-input-border h-10 w-px border-0" />
			<Button
				className="bg-destructive hover:bg-destructive p-2 text-white"
				isFullyRounded
				onPress={props.onLeave}
				isLoading={props.isLeaving}
			>
				<PhoneOff />
			</Button>
		</div>
	);
};
