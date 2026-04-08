'use client';

import * as React from 'react';

import { Container } from '@/components/ui/container';
import { MeetingTile } from '@/modules/main/organization/video-meeting/meeting-tile';
import { ScreenShareTile } from '@/modules/main/organization/video-meeting/screen-sharing-tile';
import { useVideoMeetingRoomContext } from '@/modules/main/organization/video-meeting/video-meeting-room-context';

type MeetingTilesPanelProps = {
	currentUserId: string;
	rightSlot: React.ReactNode;
};

export const MeetingTilesPanel: React.FC<MeetingTilesPanelProps> = ({
	currentUserId,
	rightSlot,
}) => {
	const { meetingSession, meetingState, tileStates, screenTile } =
		useVideoMeetingRoomContext();

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

	return (
		<>
			<div className="border-input-border relative flex-1 rounded-lg border p-4 shadow-lg">
				{mainParticipant ? (
					<MeetingTile
						participant={mainParticipant}
						tileState={mainTileState}
						meetingSession={meetingSession}
						currentUserId={currentUserId}
						isHost
					/>
				) : (
					<Container className="text-muted-foreground flex h-full min-h-[360px] items-center justify-center rounded-lg">
						Waiting for the host to join the room.
					</Container>
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
								currentUserId={currentUserId}
							/>
						))
					) : (
						<Container className="text-muted-foreground flex h-20 items-center rounded px-3 text-sm">
							Other participants will appear here once they join.
						</Container>
					)}
				</div>

				<hr className="bg-input-border h-full w-px border-0" />
				<div className="shrink-0">{rightSlot}</div>
			</div>
		</>
	);
};
