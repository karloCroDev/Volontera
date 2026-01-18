'use client';

export const useLocalStorage = (key: string) => {
	const setItem = (value: unknown) => {
		try {
			window.localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error(error);
		}
	};

	const getItem = () => {
		const item = window.localStorage.getItem(key);
		return item && JSON.parse(item);
	};

	const removeItem = () => {
		window.localStorage.removeItem(key);
	};

	return { setItem, getItem, removeItem };
};
