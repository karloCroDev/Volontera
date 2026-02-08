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
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/${url}`, {
		...init,
		headers: {
			'Content-Type': 'application/json',
			// Fetchamo ovako podatke na serveru (page.tsx), glavni razlog zašto ne koristimo axios jer axios ne može passati neke bitne tagove za cachiranje (posebno za next js), te ne možemo postaviti posebne tagove za svaku fetch operaciju, a to nam je ključno za optimizaciju performansi i user experience (npr. da se određeni podaci cachiraju, a da se drugi ne cachiraju). Također ovo je jedna centralizirana reusable funkcija kako bismo passali token automatski (umjesto da svaki put moramo iznova to raditi)
			cookie: `token=${token}`,
			...init?.headers,
		},
	});

	return (await res.json()) as Promise<T>;
}
