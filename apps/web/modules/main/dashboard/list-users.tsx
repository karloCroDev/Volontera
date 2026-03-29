'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';
import { ChevronLeft, ChevronRight, SearchIcon } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { SelectContainer, SelectItem } from '@/components/ui/select';

// Hooks
import { useDashboardPaginatedUsers } from '@/hooks/data/dashboard';
import { useDebounce } from '@/hooks/utils/useDebounce';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';
import { convertToFullname } from '@/lib/utils/converter';

// Modules
import {
	UserFilter,
	UserInfo,
	UsersInfoSkelton,
} from '@/modules/main/dashboard/users-info';

export const ListUsers = withReactQueryProvider(() => {
	const [query, setQuery] = React.useState('');
	const [filter, setFilter] = React.useState<UserFilter>('all');
	const [offset, setOffset] = React.useState(0);
	const debouncedSearch = useDebounce(query, 300);
	const normalizedSearch = debouncedSearch.trim() || undefined;

	React.useEffect(() => {
		setOffset(0);
	}, [normalizedSearch]);

	const usersQuery = useDashboardPaginatedUsers({
		offset,
		limit: 8,
		filter:
			filter === 'all'
				? undefined
				: filter === 'users'
					? 'USER'
					: 'ORGANIZATION',
		search: normalizedSearch,
	});

	const pagination = usersQuery.data?.pagination;

	return (
		<div className="border-input-border flex flex-shrink-0 flex-col overflow-hidden rounded-xl border shadow-xl">
			<Form
				className="bg-muted flex items-center justify-between px-6 py-4"
				onSubmit={(e) => e.preventDefault()}
			>
				<Input
					inputSize="sm"
					iconLeft={<SearchIcon className="size-4" />}
					label="Search"
					inputProps={{
						value: query,
						onChange: (e) => setQuery(e.target.value),
					}}
				/>
				<VolunteersSelect
					value={filter}
					onChange={(value) => {
						setOffset(0);
						setFilter(value);
					}}
				/>
			</Form>

			<div className="flex h-[520px] flex-col items-center">
				{usersQuery.isLoading &&
					[...Array(8)].map((_, index) => <UsersInfoSkelton key={index} />)}
				{usersQuery.data?.users && usersQuery.data.users.length > 0 ? (
					usersQuery.data?.users.map((user) => {
						return <UserInfo key={user.id} user={user} />;
					})
				) : (
					<p className="text-muted-foreground flex flex-1 items-center justify-center">
						No users found for the selected filters.
					</p>
				)}
			</div>

			<div className="border-input-border bg-muted mt-auto flex items-center justify-between border-t px-4 py-3">
				<p className="text-muted-foreground text-xs">
					{pagination
						? `Showing ${Math.min(pagination.total, pagination.offset + 1)}-${Math.min(
								pagination.total,
								pagination.offset + pagination.limit
							)} of ${pagination.total}`
						: 'Showing 0 users'}
				</p>
				<div className="flex items-center gap-2">
					<Button
						size="xs"
						variant="outline"
						isDisabled={offset === 0}
						onPress={() => setOffset((current) => Math.max(0, current - 8))}
						iconLeft={<ChevronLeft className="size-3.5" />}
					>
						Prev
					</Button>
					<Button
						size="xs"
						variant="outline"
						isDisabled={!pagination?.hasMore}
						onPress={() => setOffset((current) => current + 8)}
						iconRight={<ChevronRight className="size-3.5" />}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
});

const VolunteersSelect = ({
	value,
	onChange,
}: {
	value: UserFilter;
	onChange: (value: UserFilter) => void;
}) => {
	return (
		<SelectContainer
			value={value}
			onValueChange={(value) => onChange(value as UserFilter)}
			size="sm"
			isProportionalWidth
		>
			<SelectItem value="all">Everyone</SelectItem>
			<SelectItem value="users">Volunteers</SelectItem>
			<SelectItem value="organizators">Organizators</SelectItem>
		</SelectContainer>
	);
};
