'use client';

// External packages
import * as React from 'react';
import { MeetingSession, VideoTileState } from 'amazon-chime-sdk-js';
import { twJoin } from 'tailwind-merge';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Tag } from '@/components/ui/tag';
import { Container } from '@/components/ui/container';

// Lib
import { convertToFullname } from '@/lib/utils/converter';
import { OrganizationVideoMeetingParticipant } from '@repo/types/organizaton-video-meeting';

export const MeetingTile: React.FC<{
	participant: OrganizationVideoMeetingParticipant;
	tileState?: VideoTileState;
	hasAudio?: boolean;
	hasVideo?: boolean;
	meetingSession: MeetingSession | null;
	currentUserId: string;
	isHost?: boolean;
}> = ({
	currentUserId,
	hasAudio,
	hasVideo,
	meetingSession,
	participant,
	tileState,
	isHost = false,
}) => {
	const videoRef = React.useRef<HTMLVideoElement | null>(null);
	const tileId = tileState?.tileId;

	React.useEffect(() => {
		if (!meetingSession || tileId == null || !videoRef.current) {
			return;
		}

		meetingSession.audioVideo.bindVideoElement(tileId, videoRef.current);

		return () => {
			meetingSession.audioVideo.unbindVideoElement(tileId);
		};
	}, [meetingSession, tileId]);

	const hasVideoEnabled = hasVideo ?? !!tileState;
	const hasAudioEnabled = hasAudio ?? true;
	const isMuted = currentUserId === participant.userId;
	const videoState = hasVideoEnabled ? 'on' : 'off';
	const audioState = hasAudioEnabled ? 'unmuted' : 'muted';

	return isHost ? (
		<HostMeetingTile
			hasVideo={hasVideoEnabled}
			hasAudio={hasAudioEnabled}
			videoState={videoState}
			audioState={audioState}
			isMuted={isMuted}
			participant={participant}
			ref={videoRef}
		/>
	) : (
		<GuestMeetingTile
			hasVideo={hasVideoEnabled}
			hasAudio={hasAudioEnabled}
			videoState={videoState}
			audioState={audioState}
			isMuted={isMuted}
			participant={participant}
			ref={videoRef}
		/>
	);
};

type TileProps = {
	isMuted: boolean;
	hasVideo: boolean;
	hasAudio: boolean;
	videoState: 'on' | 'off';
	audioState: 'muted' | 'unmuted';
	participant: OrganizationVideoMeetingParticipant;
};

const HostMeetingTile = React.forwardRef<HTMLVideoElement | null, TileProps>(
	(
		{ audioState, isMuted, hasAudio, hasVideo, participant, videoState },
		videoRef
	) => {
		return (
			<Container className="relative size-full rounded-lg">
				{hasVideo && (
					<video
						ref={videoRef}
						autoPlay
						playsInline
						muted={isMuted}
						className="absolute inset-0 size-full object-cover"
					/>
				)}

				<div
					className={twJoin(
						'absolute z-10 flex items-end justify-between gap-3 p-4',
						hasVideo
							? 'bg-muted border-input-border bottom-2 left-2 rounded-md border'
							: 'left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent'
					)}
				>
					<div
						className={twJoin(
							'flex items-center gap-3',
							!hasVideo && 'flex-col'
						)}
					>
						<div className="flex items-center gap-4">
							<Avatar
								size="lg"
								imageProps={{
									src: participant.image
										? `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${participant.image}`
										: undefined,
								}}
								colorScheme="orange"
							>
								{convertToFullname({
									firstname: participant.firstName,
									lastname: participant.lastName,
								})}
							</Avatar>
							<div>
								<p className="text-lg font-medium">
									{convertToFullname({
										firstname: participant.firstName,
										lastname: participant.lastName,
									})}
								</p>
								<div className="mt-1 flex items-center gap-2 text-xs">
									<Tag colorScheme="green" variant="outline">
										Host
									</Tag>
									<Tag colorScheme="accent" variant="outline">
										You
									</Tag>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Container>
		);
	}
);
HostMeetingTile.displayName = 'HostMeetingTile';

const GuestMeetingTile = React.forwardRef<HTMLVideoElement | null, TileProps>(
	(
		{ audioState, isMuted, hasAudio, hasVideo, participant, videoState },
		videoRef
	) => {
		return (
			<Container
				className="relative flex aspect-video h-full flex-shrink-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-lg"
				data-has-video={String(hasVideo)}
				data-has-audio={String(hasAudio)}
				data-video-state={videoState}
				data-audio-state={audioState}
			>
				{hasVideo && (
					<video
						ref={videoRef}
						autoPlay
						playsInline
						muted={isMuted}
						className="absolute inset-0 size-full object-cover"
					/>
				)}
				{hasVideo && (
					<p className="bg-background absolute left-1 top-1 rounded-sm px-1.5 py-1 text-xs">
						{convertToFullname({
							firstname: participant.firstName,
							lastname: participant.lastName,
						})}
					</p>
				)}
				{!hasVideo && (
					<>
						<Avatar
							size="xs"
							imageProps={{
								src: participant.image
									? `${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL}/${participant.image}`
									: undefined,
							}}
						>
							{convertToFullname({
								firstname: participant.firstName,
								lastname: participant.lastName,
							})}
						</Avatar>
						<p className="text-sm">
							{convertToFullname({
								firstname: participant.firstName,
								lastname: participant.lastName,
							})}
						</p>
					</>
				)}
			</Container>
		);
	}
);
GuestMeetingTile.displayName = 'GuestMeetingTile';
