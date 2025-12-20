'use client';

// External packages
import * as React from 'react';
import { ArrowRight, MessageCircle, SearchIcon } from 'lucide-react';

// Hooks
import { useIsMobile } from '@/hooks/utils/useIsMobile';

// Components
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { LinkAsButton } from '@/components/ui/link-as-button';

export const Search = () => {
	const isMobile = useIsMobile();
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
				<div className="no-scrollbar aspect-[4/3] overflow-y-scroll">
					<Input iconLeft={<SearchIcon className="size-4" />} label="Search" />
					<hr className="bg-accent-foreground my-6 h-px border-0" />

					<h4 className="text-md underline underline-offset-4">
						Organizations
					</h4>

					<div className="mt-4 flex flex-col gap-4">
						{[...Array(3)].map((_, indx) => (
							<SearchOutput key={indx} typeHref="/home" />
						))}
					</div>

					<h4 className="text-md mt-6 underline underline-offset-4">People</h4>
					<div className="mt-4 flex flex-col gap-4">
						{[...Array(3)].map((_, indx) => (
							<SearchOutputSkeleton key={indx} />
							// <SearchOutput key={indx} typeHref="/home" />
						))}
					</div>
				</div>
			</Dialog>
		</>
	);
};

const SearchOutput: React.FC<{
	type?: 'User' | 'Organization';
	typeHref: string;
}> = ({ typeHref, type }) => {
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
				<p>Ante horvat</p>
				<p className="text-muted-foreground text-xs">{type} | ante@test.com</p>
			</div>

			<div className="ml-auto flex gap-4">
				<Button className="p-2" variant="outline" colorScheme="yellow">
					<MessageCircle />
				</Button>
				<LinkAsButton href={typeHref} className="p-2">
					<ArrowRight />
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
