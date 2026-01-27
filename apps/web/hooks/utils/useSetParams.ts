'use client';

// External packages
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const useSetParams = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const setParams = (
		params: Record<string, string | number | null | undefined>,
		options?: { replace?: boolean }
	) => {
		const current = new URLSearchParams(searchParams.toString());

		Object.entries(params).forEach(([key, value]) => {
			if (value === null || value === undefined || value === '') {
				current.delete(key);
			} else {
				current.set(key, String(value));
			}
		});

		const query = current.toString();
		const url = query ? `${pathname}?${query}` : pathname;

		if (options?.replace) {
			router.replace(url, {
				scroll: false,
			});
		} else {
			router.push(url, {
				scroll: false,
			});
		}
	};

	const removeParam = (key: string, options?: { replace?: boolean }) => {
		setParams({ [key]: null }, options);
	};

	return {
		searchParams,
		setParams,
		removeParam,
	};
};
