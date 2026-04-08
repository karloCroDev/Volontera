import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { useVideoMeetingRoomContext } from '@/modules/main/organization/video-meeting/video-meeting-room-context';
import { RetrieveOrganizationMemberResponse } from '@repo/types/organization-managment';
import { UserResponse } from '@repo/types/user';
import { PlayCircle } from 'lucide-react';
import React from 'react';

export const MeetingEntrance: React.FC<{
	userRole: RetrieveOrganizationMemberResponse['organizationMember']['role'];
}> = ({ userRole }) => {
	const { enterMeeting, hasActiveMeeting, isJoining } =
		useVideoMeetingRoomContext();
	return (
		<Container className="flex flex-1 items-center justify-center rounded-lg border p-8">
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
		</Container>
	);
};
