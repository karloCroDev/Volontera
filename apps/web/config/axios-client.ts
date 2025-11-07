// External packages
import axios, { CreateAxiosDefaults } from 'axios';

export const API = ({
	withCredentials,
	headers,
	...rest
}: CreateAxiosDefaults = {}) => {
	return axios.create({
		baseURL: process.env.NEXT_PUBLIC_API_URL,
		withCredentials: withCredentials ?? true,
		headers: headers || { 'Content-Type': 'application/json' },
		...rest,
	});
};
