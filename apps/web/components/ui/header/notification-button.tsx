'use client';

// External pakcgaes
import * as React from 'react';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Components
import { Button } from '@/components/ui/button';
import { Dot } from '@/components/ui/dot';

// Hooks
import { useHasUnreadMessages } from '@/hooks/data/notification';
import { withReactQueryProvider } from '@/lib/utils/react-query';

export const NotificationButton = withReactQueryProvider(() => {
	const router = useRouter();

	const { data } = useHasUnreadMessages();

	const [hasUnread, setHasUnread] = React.useState(data?.hasUnread);

	React.useEffect(() => {
		setHasUnread(!!data?.hasUnread);
	}, [data?.hasUnread]);

	return (
		<Button
			variant="outline"
			colorScheme="bland"
			className="relative p-2"
			onPress={() => {
				// Easier to just set it here rather than refetching
				setHasUnread(false);
				router.push('/notifications');
			}}
		>
			<Bell />

			{hasUnread && (
				<Dot state="success" className="absolute -right-1 -top-1 size-3" />
			)}
		</Button>
	);
});
