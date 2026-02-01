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
	console.log(token);
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/${url}`, {
		...init,
		headers: {
			'Content-Type': 'application/json',
			// Fetching like this because nextjs doesn't forward cookies automatically in server actions, also I can't use credentials: 'include' here, so I am not using authroization bearer token sending method but instead provided method
			cookie: `token=${token}`,
			...init?.headers,
		},
	});

	return (await res.json()) as Promise<T>;
}
