'use client';

// External pakcgaes
import * as React from 'react';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Components
import { Button } from '@/components/ui/button';
import { Dot } from '@/components/ui/dot';

export const NotificationButton = () => {
	const router = useRouter();
	return (
		<Button
			variant="outline"
			colorScheme="bland"
			className="relative p-2"
			onPress={() => {
				// TODO: Remove the notifications

				router.push('/notifications');
			}}
		>
			<Bell />

			<Dot state="success" className="absolute -right-1 -top-1 size-3" />
		</Button>
	);
};
