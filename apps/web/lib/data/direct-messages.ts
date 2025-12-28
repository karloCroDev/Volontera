// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

// Schemas
import {
	SearchArgs,
	ConversationArgs,
	MessageArgs,
} from '@repo/schemas/direct-messages';

// Types
import { DataWithFiles } from '@repo/types/upload';

export async function getListOfAllDirectMessages() {
	try {
		const res = await API().get('direct-messages');
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function searchAllUsers({ query }: SearchArgs) {
	try {
		const res = await API().get(`direct-messages/search/${query}`);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function getDirectMessagesConversationById({
	conversationId,
}: ConversationArgs) {
	try {
		const res = await API().get(`direct-messages/${conversationId}`);
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function startConversationOrStartAndSendDirectMessage({
	data,
	files,
}: DataWithFiles<MessageArgs>) {
	try {
		const res = await API().post(`direct-messages/conversation/message`, data);

		if (res.data?.images && data.images && files) {
			await Promise.all(
				data.images.map(
					async (image, index) =>
						await API({
							headers: { 'Content-type': image.contentType },
						}).put(res.data.images[index].url, files[index])
				)
			);
		}
		delete res.data?.images;

		return res.data;
	} catch (err) {
		catchError(err);
	}
}
