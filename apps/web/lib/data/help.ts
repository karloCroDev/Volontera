// Lib
import { API } from '@/lib/utils/axios-client';
import { catchError } from '@/lib/utils/error';

// Schemas
import { HelpConversationSchemaArgs } from '@repo/schemas/help';

export async function getHelpConversation() {
	try {
		const res = await API().get('help/help-conversation');
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function addHelpQuestion({ message }: HelpConversationSchemaArgs) {
	try {
		const res = await API().post('help/help-conversation', { message });
		return res.data;
	} catch (err) {
		catchError(err);
	}
}

export async function deleteHelpConversation() {
	try {
		const res = await API().delete('help/help-conversation');
		return res.data;
	} catch (err) {
		catchError(err);
	}
}
