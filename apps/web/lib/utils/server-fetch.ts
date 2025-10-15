'use server';

// External packages
import { cookies } from 'next/headers';

export async function serverFetch<T = unknown>({
	url,
	init,
}: {
	url: string | URL | Request;
	init?: RequestInit | undefined;
}): Promise<T> {
	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;

	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, {
		...init,
		headers: {
			'Content-Type': 'application/json',
			...(token ? { cookie: `token=${token}` } : {}),
			...init?.headers,
		},
	});

	if (!res.ok) {
		throw new Error(`Fetch failed (${res.status}`);
	}

	return (await res.json()) as Promise<T>;
}
