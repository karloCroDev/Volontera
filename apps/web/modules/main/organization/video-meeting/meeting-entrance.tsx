// External packages
import * as React from 'react';
import { PlayCircle } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

// Modueles
import { useVideoMeetingRoomContext } from '@/modules/main/organization/video-meeting/video-meeting-room-context';

// Types
import { RetrieveOrganizationMemberResponse } from '@repo/types/organization-managment';
import { hasWantedOrganizationRole } from '@repo/permissons/index';

export const MeetingEntrance: React.FC<{
	userRole: RetrieveOrganizationMemberResponse['organizationMember']['role'];
}> = ({ userRole }) => {
	const { enterMeeting, hasActiveMeeting, isJoining } =
		useVideoMeetingRoomContext();
	const canStartMeeting = hasWantedOrganizationRole({
		requiredRoles: ['OWNER', 'ADMIN'],
		userRole,
	});
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
						: canStartMeeting
							? 'Start the organization meeting when you are ready. Once it begins, members can join immediately.'
							: 'There is no meeting ongoing right now. Wait for the owner or an admin to start one.'}
				</p>

				<div className="mt-6 flex flex-wrap justify-center gap-3">
					{!hasActiveMeeting && canStartMeeting && (
						<Button onPress={() => enterMeeting('start')} isLoading={isJoining}>
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
