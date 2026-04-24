'use client';

// External packages
import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
	ConsoleLogger,
	DefaultDeviceController,
	DefaultMeetingSession,
	LogLevel,
	MeetingSession,
	MeetingSessionConfiguration,
	VideoTileState,
} from 'amazon-chime-sdk-js';

// Hooks
import {
	useEndOrganizationVideoMeeting,
	useJoinOrganizationVideoMeeting,
	useLeaveOrganizationVideoMeeting,
	useRetrieveOrganizationVideoMeetingState,
	useStartOrganizationVideoMeeting,
} from '@/hooks/data/organization-video-meeting';

// Modules
import { useSocketContext } from '@/modules/main/direct-messages/socket-context';

// Types
import {
	OrganizationVideoMeetingJoinResponse,
	OrganizationVideoMeetingState,
} from '@repo/types/organizaton-video-meeting';
import { RetrieveOrganizationMemberResponse } from '@repo/types/organization-managment';
import { UserResponse } from '@repo/types/user';

const VideoMeetingRoomContext = React.createContext<{
	audioElementRef: React.RefObject<HTMLAudioElement | null>;
	meetingSession: MeetingSession | null;
	meetingState: OrganizationVideoMeetingState['meeting'];
	tileStates: Record<string, VideoTileState>;
	isJoining: boolean;
	isLeaving: boolean;
	permissionError: string | null;
	canShareScreen: boolean;
	hasActiveMeeting: boolean;
	screenTile: VideoTileState | null;
	enterMeeting: (mode: 'start' | 'join') => Promise<void>;
	handleLeaveMeeting: () => Promise<void>;
} | null>(null);

export const useVideoMeetingRoomContext = () => {
	const ctx = React.useContext(VideoMeetingRoomContext);
	if (!ctx) {
		throw new Error('VideoMeetingRoomContext is not available');
	}

	return ctx;
};

export const VideoMeetingRoomContextProvider: React.FC<{
	organizationId: string;
	currentUser: UserResponse;
	userRole: RetrieveOrganizationMemberResponse['organizationMember']['role'];
	children: React.ReactNode;
}> = ({ organizationId, currentUser, userRole, children }) => {
	const router = useRouter();
	const { socketGlobal } = useSocketContext();

	const { data: meetingStateData } =
		useRetrieveOrganizationVideoMeetingState(organizationId);

	const startMeeting = useStartOrganizationVideoMeeting();
	const joinMeeting = useJoinOrganizationVideoMeeting();
	const leaveMeeting = useLeaveOrganizationVideoMeeting();
	const endMeeting = useEndOrganizationVideoMeeting();

	const [meetingSession, setMeetingSession] =
		React.useState<MeetingSession | null>(null);
	const [meetingState, setMeetingState] = React.useState<
		OrganizationVideoMeetingState['meeting']
	>(meetingStateData.meeting);
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
		setMeetingState(meetingStateData.meeting ?? null);
	}, [meetingStateData.meeting]);

	const canShareScreen =
		!!meetingState?.meeting && meetingState.hostUserId === currentUser.id;
	const hasActiveMeeting = !!meetingState?.meeting;

	const cleanupMeetingSession = React.useCallback(() => {
		const activeSession = meetingSessionRef.current;

		try {
			activeSession?.audioVideo.stopContentShare();
		} catch {
			console.error('Error stopping content share');
		}

		try {
			activeSession?.audioVideo.stopLocalVideoTile();
		} catch {
			console.error('Error stopping local video tile');
		}

		try {
			activeSession?.audioVideo.stopVideoInput();
		} catch {
			console.error('Error stopping video input');
		}

		try {
			activeSession?.audioVideo.stopAudioInput();
		} catch {
			console.error('Error stopping audio input');
		}

		try {
			activeSession?.audioVideo.stop();
		} catch {
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
						? 'Camera or microphone access was denied.. chech the permissons'
						: 'Unable to join with camera/microphone check permissson'
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
			hasAutoEnteredRef.current ||
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

	React.useEffect(() => () => cleanupMeetingSession(), [cleanupMeetingSession]);

	return (
		<VideoMeetingRoomContext.Provider
			value={{
				audioElementRef,
				meetingSession,
				meetingState,
				tileStates,
				isJoining,
				isLeaving,
				permissionError,
				canShareScreen,
				hasActiveMeeting,
				screenTile,
				enterMeeting,
				handleLeaveMeeting,
			}}
		>
			{children}
		</VideoMeetingRoomContext.Provider>
	);
};
