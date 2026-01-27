'use client';

// External packages
import * as React from 'react';
import { Search } from 'lucide-react';

import { useAsyncList } from 'react-stately';

// Components
import { ComboBoxItems, ComboBoxWrapper } from '@/components/ui/combo-box';

// Schemas

// Lib
import { searchAllUsers } from '@/lib/data/direct-messages';

// Hooks
import { useDebounce } from '@/hooks/utils/useDebounce';
import {
	UsersSidebar,
	UsersSidebarSkeleton,
} from '@/modules/main/direct-messages/users-sidebar';

type SearchUser = {
	id: string;
	firstName: string;
	lastName: string;
	role?: string | null;
};

export const UsersSearch = () => {
	const [query, setQuery] = React.useState('');
	const debouncedQuery = useDebounce(query, 300);
	const isTyping = query !== debouncedQuery;

	const list = useAsyncList<SearchUser>({
		async load({ filterText }) {
			const q = (filterText ?? '').trim();
			if (!q) return { items: [] };

			const res = await searchAllUsers({ query: q });
			return { items: (res?.users ?? []) as SearchUser[] };
		},
	});
	const { filterText, setFilterText } = list;

	React.useEffect(() => {
		if (filterText !== debouncedQuery) {
			setFilterText(debouncedQuery);
		}
	}, [debouncedQuery, filterText, setFilterText]);

	const showLoading = query.trim().length > 0 && (isTyping || list.isLoading);
	const showNoUsers =
		debouncedQuery.trim().length > 0 && !showLoading && list.items.length === 0;

	return (
		<ComboBoxWrapper
			inputValue={query}
			onInputChange={setQuery}
			defaultFilter={() => true}
			menuTrigger="input"
			inputProps={{
				label: 'Search users...',
				iconLeft: <Search className="size-4" />,
			}}
		>
			{showLoading &&
				[...Array(4)].map((_, indx) => (
					<ComboBoxItems
						key={`loading-${indx}`}
						id={`loading-${indx}`}
						isDisabled
					>
						<UsersSidebarSkeleton />
					</ComboBoxItems>
				))}

			{showNoUsers && (
				<ComboBoxItems id="no-users" isDisabled removeUnderline>
					<div className="text-muted-foreground px-2 py-1 text-sm">
						No users found
					</div>
				</ComboBoxItems>
			)}

			{!showLoading &&
				!showNoUsers &&
				list.items.map((user, indx) => (
					<ComboBoxItems
						key={user.id}
						id={user.id}
						textValue={`${user.firstName} ${user.lastName}`}
						removeUnderline={indx === list.items.length - 1}
					>
						<UsersSidebar
							username={`${user.firstName} ${user.lastName}`}
							userRole={user.role!}
							id={user.id}
							removeUnderline={indx === list.items.length - 1}
						/>
					</ComboBoxItems>
				))}
		</ComboBoxWrapper>
	);
};
