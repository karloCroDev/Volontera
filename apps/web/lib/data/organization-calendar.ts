// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

// Schemas
import {
	CreateOrganizationEventArgs,
	DeleteOrganizationEventArgs,
	RetrieveOrganizationCalendarArgs,
	UpdateOrganizationEventArgs,
} from '@repo/schemas/organization-calendar';

export async function retrieveOrganizationCalendar({
	organizationId,
}: RetrieveOrganizationCalendarArgs) {
	try {
		const res = await API().get(`/organization-calendar/${organizationId}`);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function createOrganizationEvent(
	data: CreateOrganizationEventArgs
) {
	try {
		const res = await API().post('/organization-calendar/events', data);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function updateOrganizationEvent(
	data: UpdateOrganizationEventArgs
) {
	try {
		const res = await API().patch('/organization-calendar/events', data);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function deleteOrganizationEvent({
	eventId,
}: DeleteOrganizationEventArgs) {
	try {
		const res = await API().delete(`/organization-calendar/events/${eventId}`);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
