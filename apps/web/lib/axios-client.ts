import axios from 'axios';

export const API = (isJSON: boolean = true) => {
	const headers: Record<string, string> = {};

	if (isJSON) headers['Content-Type'] = 'application/json';

	axios.create({
		baseURL: process.env.NEXT_PUBLIC_API_URL,
		withCredentials: true, // includes cookies or auth headers
		headers: {
			...headers,
		},
	});
};
