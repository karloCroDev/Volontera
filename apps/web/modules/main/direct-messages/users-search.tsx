'use client';

// External packages
import * as React from 'react';
import { Search } from 'lucide-react';

// Components
import { ComboBoxItems, ComboBoxWrapper } from '@/components/ui/combo-box';

// Schemas

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';

// Hooks
import { useSearchAllUsers } from '@/hooks/data/direct-messages';
import { useDebounce } from '@/hooks/utils/useDebounce';
import {
	UsersSidebar,
	UsersSidebarSkeleton,
} from '@/modules/main/direct-messages/users-sidebar';

export const UsersSearch = withReactQueryProvider(() => {
	const [query, setQuery] = React.useState('');
	// TODO: Find out if there is some problems with fetching this data
	const debouncedQuery = useDebounce(query);
	const { data, isPending } = useSearchAllUsers(
		{
			// Debouncam vrijednost ako je duzina veca od 2 karaktera (bolji iskustvo za korisnika)
			query: debouncedQuery,
		},
		{
			enabled: debouncedQuery.length > 0,
			refetchOnWindowFocus: false,
		}
	);

	return (
		<ComboBoxWrapper
			inputProps={{
				label: 'Search users...',
				iconLeft: <Search className="size-4" />,
				inputProps: {
					onChange: (e) => setQuery(e.target.value),
					value: query,
				},
			}}
		>
			{(query !== debouncedQuery || isPending) &&
				[...Array(4)].map((_, indx) => (
					<ComboBoxItems key={indx}>
						<UsersSidebarSkeleton />
					</ComboBoxItems>
				))}
			{data &&
				data.users.length > 0 &&
				data?.users.map((user, indx) => (
					<ComboBoxItems
						key={user.id}
						id={user.id}
						textValue={`${user.firstName} ${user.lastName}`}
						removeUnderline={indx === data.users.length - 1}
					>
						<UsersSidebar
							key={user.id}
							username={`${user.firstName} ${user.lastName}`}
							userRole={user.role!}
							id={user.id}
							removeUnderline={indx === data.users.length - 1}
						/>
					</ComboBoxItems>
				))}
		</ComboBoxWrapper>
	);
});
