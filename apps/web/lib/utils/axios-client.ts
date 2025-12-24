// External packages
import axios, { CreateAxiosDefaults } from 'axios';

export const API = ({
	withCredentials,
	headers,
	...rest
}: CreateAxiosDefaults = {}) => {
	return axios.create({
		baseURL: 'http://localhost:4000',
		withCredentials: withCredentials ?? true,
		headers: headers || { 'Content-Type': 'application/json' },
		...rest,
	});
};
