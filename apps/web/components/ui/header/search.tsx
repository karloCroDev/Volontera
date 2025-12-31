'use client';

// External packages
import * as React from 'react';
import { ArrowRight, MessageCircle, SearchIcon, User } from 'lucide-react';

// Hooks
import { useIsMobile } from '@/hooks/utils/useIsMobile';

// Components
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { LinkAsButton } from '@/components/ui/link-as-button';

// Hooks
import { useSearch } from '@/hooks/data/search';
import { useDebounce } from '@/hooks/utils/useDebounce';
import { convertToFullname } from '@/lib/utils/convert-to-fullname';

export const Search = () => {
	const isMobile = useIsMobile();

	const [query, setQuery] = React.useState('');

	const debounedValue = useDebounce(query, 300);
	const { data, isLoading } = useSearch(
		{ query: debounedValue },
		{
			enabled: debounedValue.length > 0,
			refetchOnWindowFocus: false,
		}
	);
	return (
		<>
			<Dialog
				title="Search"
				subtitle="Find all things you have been looking for!"
				triggerChildren={
					<Button
						variant="outline"
						colorScheme="bland"
						className="relative p-2 lg:pl-4 lg:pr-12"
						iconLeft={<SearchIcon />}
						isFullyRounded={!isMobile}
					>
						{!isMobile && 'Search'}
					</Button>
				}
			>
				<div className="aspect-[4/3] overflow-y-scroll">
					<Input
						iconLeft={<SearchIcon className="size-4" />}
						label="Search"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
					<hr className="bg-accent-foreground my-6 h-px border-0" />

					<h4 className="text-md underline underline-offset-4">
						Organizations
					</h4>

					<div className="mt-4 flex flex-col gap-4">
						{isLoading &&
							[...Array(2)].map((_, indx) => (
								<SearchOutputSkeleton key={indx} />
							))}
						{data?.organizations && data.organizations.length > 0 ? (
							data.organizations.map((organization) => (
								<SearchOutput
									key={organization.id}
									type="organization"
									name={organization.name}
									info={organization.bio.substring(0, 20) + '...'}
									mainLink={`/organization/${organization.id}`}
									chatLink={`/organization/${organization.id}/messages`}
								/>
							))
						) : (
							<p className="text-muted-foreground text-center">
								No organizations found
							</p>
						)}
					</div>

					<h4 className="text-md mt-6 underline underline-offset-4">People</h4>
					<div className="mt-4 flex flex-col gap-4">
						{isLoading &&
							[...Array(2)].map((_, indx) => (
								<SearchOutputSkeleton key={indx} />
							))}

						{data?.users && data.users.length > 0 ? (
							data.users.map((user) => (
								<SearchOutput
									key={user.id}
									type="user"
									name={convertToFullname({
										firstname: user.firstName,
										lastname: user.lastName,
									})}
									info={user.email}
									mainLink={`/profile/${user.id}`}
									// TODO: See how I handled if there is no conversation ID, but the message still works
									chatLink={`direct-messages?user=${user.id}`}
								/>
							))
						) : (
							<p className="text-muted-foreground text-center">
								No users found
							</p>
						)}
					</div>
				</div>
			</Dialog>
		</>
	);
};

const SearchOutput: React.FC<{
	type: 'user' | 'organization';
	mainLink: string;
	chatLink: string;
	name: string;
	info: string;
}> = ({ mainLink, chatLink, type, name, info }) => {
	return (
		<div className="border-input-border flex items-center gap-4 rounded-lg border px-5 py-3">
			<Avatar
				imageProps={{
					src: '',
				}}
				size="lg"
				colorScheme="gray"
			>
				Ante Horvat
			</Avatar>

			<div>
				<p>{name}</p>
				<p className="text-muted-foreground text-xs">{info}</p>
			</div>

			<div className="ml-auto flex gap-4">
				<LinkAsButton
					href={chatLink}
					className="p-2"
					variant="outline"
					colorScheme="yellow"
				>
					<MessageCircle />
				</LinkAsButton>

				<LinkAsButton href={mainLink} className="p-2">
					{type === 'user' ? <User /> : <ArrowRight />}
				</LinkAsButton>
			</div>
		</div>
	);
};

const SearchOutputSkeleton = () => (
	<div className="border-input-border flex animate-pulse items-center gap-4 rounded-lg border px-5 py-3">
		<div className="bg-muted-foreground h-12 w-12 rounded-full" />

		<div className="flex flex-col gap-1">
			<div className="bg-muted-foreground h-4 w-32 rounded" />
			<div className="bg-muted-foreground/40 h-3 w-40 rounded text-xs" />
		</div>

		<div className="ml-auto flex gap-4">
			<div className="border-muted-foreground size-8 rounded-lg border" />
			<div className="bg-muted-foreground size-8 rounded-lg" />
		</div>
	</div>
);
