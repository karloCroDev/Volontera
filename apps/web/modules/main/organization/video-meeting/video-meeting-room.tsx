'use client';

// External packages
import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
	ConsoleLogger,
	DefaultDeviceController,
	DefaultMeetingSession,
	LogLevel,
	MeetingSessionConfiguration,
	MeetingSession,
	VideoTileState,
} from 'amazon-chime-sdk-js';
import { Loader2, PlayCircle } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

// Modules
import { VideoOptions } from '@/modules/main/organization/video-meeting/video-options';
import { useSocketContext } from '@/modules/main/direct-messages/socket-context';

// Hooks
import {
	useEndOrganizationVideoMeeting,
	useJoinOrganizationVideoMeeting,
	useLeaveOrganizationVideoMeeting,
	useRetrieveOrganizationVideoMeetingState,
	useStartOrganizationVideoMeeting,
} from '@/hooks/data/organization-video-meeting';

// Lib
import {
	OrganizationVideoMeetingJoinResponse,
	OrganizationVideoMeetingState,
} from '@repo/types/organizaton-video-meeting';

// Modules
import { MeetingTile } from '@/modules/main/organization/video-meeting/meeting-tile';

// Types
import { UserResponse } from '@repo/types/user';
import { ScreenShareTile } from '@/modules/main/organization/video-meeting/screen-sharing-tile';

export const VideoMeetingRoom: React.FC<{
	organizationId: string;
	currentUser: UserResponse;
	userRole: 'OWNER' | 'ADMIN' | 'MEMBER' | 'BANNED';
	initialMode?: 'start' | 'join' | undefined;
}> = ({ organizationId, currentUser, userRole, initialMode }) => {
	const router = useRouter();
	const { socketGlobal } = useSocketContext();

	const { data: meetingStateData } = useRetrieveOrganizationVideoMeetingState(
		organizationId,
		{
			staleTime: 15 * 1000,
		}
	);

	const startMeeting = useStartOrganizationVideoMeeting();
	const joinMeeting = useJoinOrganizationVideoMeeting();
	const leaveMeeting = useLeaveOrganizationVideoMeeting();
	const endMeeting = useEndOrganizationVideoMeeting();

	const [meetingSession, setMeetingSession] =
		React.useState<MeetingSession | null>(null);
	const [meetingState, setMeetingState] =
		React.useState<OrganizationVideoMeetingState['meeting']>(null);
	const [tileStates, setTileStates] = React.useState<
		Record<string, VideoTileState>
	>({});
	const [screenTile, setScreenTile] = React.useState<VideoTileState | null>(
		null
	);
	const [isJoining, setIsJoining] = React.useState(false);
	const [isLeaving, setIsLeaving] = React.useState(false);
	const [permissionError, setPermissionError] = React.useState<string | null>(
		null
	);

	const audioElementRef = React.useRef<HTMLAudioElement | null>(null);
	const meetingSessionRef = React.useRef<MeetingSession | null>(null);
	const hasAutoEnteredRef = React.useRef(false);
	const isLeavingRef = React.useRef(false);

	React.useEffect(() => {
		setMeetingState(meetingStateData?.meeting ?? null);
	}, [meetingStateData]);

	const canShareScreen =
		!!meetingState?.meeting && meetingState.hostUserId === currentUser.id;
	const hasActiveMeeting = !!meetingState?.meeting;

	const cleanupMeetingSession = React.useCallback(() => {
		const activeSession = meetingSessionRef.current;

		try {
			activeSession?.audioVideo.stopContentShare();
		} catch {
			// TODO: Handleaj malo bolje ove errore!!
			console.error('Error stopping content share');
		}

		try {
			activeSession?.audioVideo.stopLocalVideoTile();
		} catch {
			// TODO: Handleaj malo bolje ove errore!!
			console.error('Error stopping local video tile');
		}

		try {
			activeSession?.audioVideo.stop();
		} catch {
			// TODO: Handleaj malo bolje ove errore!!
			console.error('Error stopping audio video');
		}

		meetingSessionRef.current = null;
		setMeetingSession(null);
		setTileStates({});
		setScreenTile(null);
		setIsJoining(false);
		setIsLeaving(false);
		setPermissionError(null);
	}, []);

	const prepareLocalDevices = React.useCallback(
		async (session: MeetingSession) => {
			const [audioDevices, videoDevices] = await Promise.all([
				session.audioVideo.listAudioInputDevices(),
				session.audioVideo.listVideoInputDevices(),
			]);

			const firstAudioDevice = audioDevices[0];
			if (firstAudioDevice) {
				await session.audioVideo.startAudioInput(firstAudioDevice.deviceId);
			}

			const firstVideoDevice = videoDevices[0];
			if (firstVideoDevice) {
				await session.audioVideo.startVideoInput(firstVideoDevice.deviceId);
			}
		},
		[]
	);

	React.useEffect(() => {
		if (!socketGlobal) {
			return;
		}

		socketGlobal.emit('organization-video-meeting-room', organizationId);

		const handleMeetingUpdate = (
			payload: OrganizationVideoMeetingState & { isActive: boolean }
		) => {
			setMeetingState(payload.meeting ?? null);
		};

		const handleMeetingEnded = () => {
			isLeavingRef.current = true;
			cleanupMeetingSession();
			router.replace(`/organization/${organizationId}`);
		};

		socketGlobal.on('organization-video-meeting:update', handleMeetingUpdate);
		socketGlobal.on('organization-video-meeting:ended', handleMeetingEnded);

		return () => {
			socketGlobal.off(
				'organization-video-meeting:update',
				handleMeetingUpdate
			);
			socketGlobal.off('organization-video-meeting:ended', handleMeetingEnded);
			socketGlobal.emit(
				'organization-video-meeting-room:leave',
				organizationId
			);
		};
	}, [cleanupMeetingSession, organizationId, router, socketGlobal]);

	const initializeMeetingSession = React.useCallback(
		async (
			meetingResponse: OrganizationVideoMeetingJoinResponse['meetingResponse'],
			attendeeResponse: OrganizationVideoMeetingJoinResponse['attendeeResponse']
		) => {
			if (!meetingResponse.Meeting || !attendeeResponse.Attendee) {
				throw new Error('Incomplete meeting session data');
			}

			const logger = new ConsoleLogger(
				'OrganizationVideoMeeting',
				LogLevel.WARN
			);
			const deviceController = new DefaultDeviceController(logger);
			const session = new DefaultMeetingSession(
				new MeetingSessionConfiguration(meetingResponse, attendeeResponse),
				logger,
				deviceController
			);

			session.audioVideo.addObserver({
				videoTileDidUpdate: (tileState) => {
					if (tileState.isContent) {
						setScreenTile(tileState);
						return;
					}

					if (!tileState.boundAttendeeId) {
						return;
					}

					setTileStates((current) => ({
						...current,
						[tileState.boundAttendeeId as string]: tileState,
					}));
				},
				videoTileWasRemoved: (tileId) => {
					setTileStates((current) => {
						const next = { ...current };
						Object.entries(next).forEach(([attendeeId, tile]) => {
							if (tile.tileId === tileId) {
								delete next[attendeeId];
							}
						});
						return next;
					});

					setScreenTile((current) =>
						current?.tileId === tileId ? null : current
					);
				},
				audioVideoDidStop: () => {
					if (isLeavingRef.current) {
						return;
					}

					cleanupMeetingSession();
					router.replace(`/organization/${organizationId}`);
				},
			});

			if (audioElementRef.current) {
				session.audioVideo.bindAudioElement(audioElementRef.current);
			}

			try {
				await prepareLocalDevices(session);
				setPermissionError(null);
			} catch (error) {
				const permissionDenied =
					error instanceof DOMException &&
					(error.name === 'NotAllowedError' ||
						error.name === 'PermissionDeniedError');

				setPermissionError(
					permissionDenied
						? 'Camera or microphone access was denied. Please allow permissions for this site in your browser settings and rejoin the meeting.'
						: 'Unable to access camera or microphone. Check if another app is using your devices and try again.'
				);
			}

			session.audioVideo.start();

			try {
				await session.audioVideo.startLocalVideoTile();
			} catch {
				// Karlo: Handleaj malo bolje ove errore!!
				console.error('Error starting local video tile');
			}

			meetingSessionRef.current = session;
			setMeetingSession(session);
		},
		[cleanupMeetingSession, organizationId, prepareLocalDevices, router]
	);

	const enterMeeting = React.useCallback(
		async (mode: 'start' | 'join') => {
			if (isJoining || meetingSession) {
				return;
			}

			setIsJoining(true);

			try {
				setPermissionError(null);
				const response =
					mode === 'start'
						? await startMeeting.mutateAsync(organizationId)
						: await joinMeeting.mutateAsync(organizationId);

				if (!response?.meetingResponse || !response?.attendeeResponse) {
					return;
				}

				setMeetingState(response.meeting);
				await initializeMeetingSession(
					response.meetingResponse,
					response.attendeeResponse
				);
			} catch (error) {
				const permissionDenied =
					error instanceof DOMException &&
					(error.name === 'NotAllowedError' ||
						error.name === 'PermissionDeniedError');

				setPermissionError(
					permissionDenied
						? 'Camera or microphone access was denied. Please allow permissions for this site and join again.'
						: 'Unable to join with camera/microphone. Please verify browser permissions and device availability.'
				);
			} finally {
				setIsJoining(false);
			}
		},
		[
			initializeMeetingSession,
			isJoining,
			joinMeeting,
			meetingSession,
			organizationId,
			startMeeting,
		]
	);

	React.useEffect(() => {
		if (
			!initialMode ||
			hasAutoEnteredRef.current ||
			meetingSession ||
			isJoining
		) {
			return;
		}

		hasAutoEnteredRef.current = true;
		enterMeeting(initialMode);
	}, [enterMeeting, initialMode, isJoining, meetingSession]);

	React.useEffect(() => {
		if (
			hasAutoEnteredRef.current ||
			!!initialMode ||
			meetingSession ||
			isJoining ||
			isLeaving ||
			userRole === 'BANNED' ||
			!hasActiveMeeting
		) {
			return;
		}

		hasAutoEnteredRef.current = true;
		enterMeeting('join');
	}, [
		enterMeeting,
		hasActiveMeeting,
		initialMode,
		isJoining,
		isLeaving,
		meetingSession,
		userRole,
	]);

	const handleLeaveMeeting = React.useCallback(async () => {
		if (isLeaving) {
			return;
		}

		isLeavingRef.current = true;
		setIsLeaving(true);

		try {
			if (canShareScreen) {
				await endMeeting.mutateAsync(organizationId);
			} else {
				await leaveMeeting.mutateAsync(organizationId);
			}
		} finally {
			cleanupMeetingSession();
			router.push(`/organization/${organizationId}`);
		}
	}, [
		canShareScreen,
		cleanupMeetingSession,
		endMeeting,
		isLeaving,
		leaveMeeting,
		organizationId,
		router,
	]);

	const participantList = React.useMemo(
		() => meetingState?.participants ?? [],
		[meetingState?.participants]
	);

	const mainParticipant =
		participantList.find((participant) => participant.isHost) ??
		participantList[0];
	const secondaryParticipants = participantList.filter(
		(participant) => !participant.isHost
	);

	const mainTileState = mainParticipant
		? tileStates[mainParticipant.attendeeId]
		: undefined;

	const secondaryTiles = secondaryParticipants
		.map((participant) => ({
			participant,
			tileState: tileStates[participant.attendeeId],
		}))
		.filter(
			({ participant }) => participant.userId !== mainParticipant?.userId
		);

	const isRoomLive = !!meetingSession;

	return (
		<div className="flex h-full flex-col gap-4">
			<audio ref={audioElementRef} autoPlay />

			{permissionError && (
				<div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{permissionError}
				</div>
			)}

			{!isRoomLive ? (
				<div className="border-input-border bg-muted/30 flex flex-1 items-center justify-center rounded-lg border p-8 shadow-lg">
					<div className="max-w-xl text-center">
						<div className="border-input-border bg-background mx-auto mb-6 flex size-16 items-center justify-center rounded-lg border shadow-lg">
							<PlayCircle className="text-primary size-8" />
						</div>

						<h2 className="text-2xl font-semibold">No ongoing meeting</h2>
						<p className="text-muted-foreground mt-3">
							{hasActiveMeeting
								? 'A meeting is currently live. Join to enter the room.'
								: userRole === 'OWNER' || userRole === 'ADMIN'
									? 'Start the organization meeting when you are ready. Once it begins, members can join immediately.'
									: 'There is no meeting ongoing right now. Wait for the owner or an admin to start one.'}
						</p>

						<div className="mt-6 flex flex-wrap justify-center gap-3">
							{!hasActiveMeeting &&
								(userRole === 'OWNER' || userRole === 'ADMIN') && (
									<Button
										onPress={() => enterMeeting('start')}
										isLoading={isJoining}
									>
										Start meeting
									</Button>
								)}

							{hasActiveMeeting && (
								<Button
									variant="outline"
									onPress={() => enterMeeting('join')}
									isLoading={isJoining}
								>
									Join meeting
								</Button>
							)}
						</div>
					</div>
				</div>
			) : (
				<>
					<div className="border-input-border relative flex-1 rounded-lg border p-4 shadow-lg">
						{mainParticipant ? (
							<MeetingTile
								participant={mainParticipant}
								tileState={mainTileState}
								meetingSession={meetingSession}
								currentUserId={currentUser.id}
								isHost
							/>
						) : (
							<div className="bg-muted/40 text-muted-foreground flex h-full min-h-[360px] items-center justify-center rounded-lg">
								Waiting for the host to join the room.
							</div>
						)}

						{screenTile && meetingSession && (
							<div className="absolute right-4 top-4 h-40 w-64">
								<ScreenShareTile
									tileState={screenTile}
									meetingSession={meetingSession}
								/>
							</div>
						)}
					</div>

					<div className="flex items-center gap-4">
						<div className="flex h-20 flex-1 gap-4 overflow-x-scroll">
							{secondaryTiles.length > 0 ? (
								secondaryTiles.map(({ participant, tileState }) => (
									<MeetingTile
										key={participant.userId}
										participant={participant}
										tileState={tileState}
										meetingSession={meetingSession}
										currentUserId={currentUser.id}
									/>
								))
							) : (
								<Container className="text-muted-foreground flex h-20 items-center rounded px-3 text-sm">
									Other participants will appear here once they join.
								</Container>
							)}
						</div>

						<hr className="bg-input-border h-full w-px border-0" />
						<div className="shrink-0">
							<VideoOptions
								meetingSession={meetingSession}
								canShareScreen={canShareScreen}
								isLeaving={isLeaving}
								onLeave={() => handleLeaveMeeting()}
							/>
						</div>
					</div>
				</>
			)}

			{isJoining && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm">
					<div className="flex items-center gap-3 rounded-full border border-white/15 bg-black/80 px-4 py-3 text-sm text-white shadow-2xl">
						<Loader2 className="size-4 animate-spin" />
						Preparing the meeting room...
					</div>
				</div>
			)}
		</div>
	);
};
