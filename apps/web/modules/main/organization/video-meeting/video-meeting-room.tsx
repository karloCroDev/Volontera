'use client';

import * as React from 'react';

// Modules
import { VideoOptions } from '@/modules/main/organization/video-meeting/video-options';
import { JoiningMeetingOverlay } from '@/modules/main/organization/video-meeting/joining-meeting-overlay';

// Types
import { UserResponse } from '@repo/types/user';
import { MeetingEntrance } from '@/modules/main/organization/video-meeting/meeting-entrance';
import { RetrieveOrganizationMemberResponse } from '@repo/types/organization-managment';
import { useVideoMeetingRoomContext } from '@/modules/main/organization/video-meeting/video-meeting-room-context';
import { MeetingTilesPanel } from '@/modules/main/organization/video-meeting/meeting-tiles-panel';

export const VideoMeetingRoom: React.FC<{
	currentUser: UserResponse;
	userRole: RetrieveOrganizationMemberResponse['organizationMember']['role'];
}> = ({ currentUser, userRole }) => {
	const { audioElementRef, meetingSession, isJoining, permissionError } =
		useVideoMeetingRoomContext();

	return (
		<div className="flex h-full min-h-[600px] flex-col gap-4">
			<audio ref={audioElementRef} autoPlay />

			{permissionError && (
				<div className="border-destructive/80 bg-destructive rounded-lg border px-4 py-3 text-sm text-white">
					{permissionError}
				</div>
			)}
			{!meetingSession ? (
				<MeetingEntrance userRole={userRole} />
			) : (
				<>
					<MeetingTilesPanel
						currentUserId={currentUser.id}
						rightSlot={<VideoOptions />}
					/>
				</>
			)}

			{isJoining && <JoiningMeetingOverlay />}
		</div>
	);
};
