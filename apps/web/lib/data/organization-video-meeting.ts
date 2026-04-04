// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

import {
	OrganizationVideoMeetingJoinResponse,
	OrganizationVideoMeetingLeaveResponse,
	OrganizationVideoMeetingState,
} from '@repo/types/organizaton-video-meeting';

export async function retrieveOrganizationVideoMeetingState(
	organizationId: string
): Promise<OrganizationVideoMeetingState> {
	try {
		const response = await API().get(
			`/organization-video-meeting/state/${organizationId}`
		);
		return response.data as OrganizationVideoMeetingState;
	} catch (err) {
		catchError(err);
	}

	throw new Error('Unable to retrieve organization video meeting state');
}

export async function startOrganizationVideoMeeting(
	organizationId: string
): Promise<OrganizationVideoMeetingJoinResponse> {
	try {
		const response = await API().post(
			`/organization-video-meeting/start/${organizationId}`
		);
		return response.data as OrganizationVideoMeetingJoinResponse;
	} catch (err) {
		catchError(err);
	}

	throw new Error('Unable to start organization video meeting');
}

export async function joinOrganizationVideoMeeting(
	organizationId: string
): Promise<OrganizationVideoMeetingJoinResponse> {
	try {
		const response = await API().post(
			`/organization-video-meeting/join/${organizationId}`
		);
		return response.data as OrganizationVideoMeetingJoinResponse;
	} catch (err) {
		catchError(err);
	}

	throw new Error('Unable to join organization video meeting');
}

export async function leaveOrganizationVideoMeeting(
	organizationId: string
): Promise<OrganizationVideoMeetingLeaveResponse> {
	try {
		const response = await API().post(
			`/organization-video-meeting/leave/${organizationId}`
		);
		return response.data as OrganizationVideoMeetingLeaveResponse;
	} catch (err) {
		catchError(err);
	}

	throw new Error('Unable to leave organization video meeting');
}

export async function endOrganizationVideoMeeting(
	organizationId: string
): Promise<OrganizationVideoMeetingLeaveResponse> {
	try {
		const response = await API().post(
			`/organization-video-meeting/end/${organizationId}`
		);
		return response.data as OrganizationVideoMeetingLeaveResponse;
	} catch (err) {
		catchError(err);
	}

	throw new Error('Unable to end organization video meeting');
}
