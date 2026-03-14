'use client';

// External packages
import * as React from 'react';
import { Form } from 'react-aria-components';
import { SearchIcon } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { SelectContainer, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

// Lib
import { withReactQueryProvider } from '@/lib/utils/react-query';

export const ListUsers = withReactQueryProvider(() => {
	const [query, setQuery] = React.useState('');
	return (
		<Form
			className="border-input-border min-h-1/2 max-h-3/4 flex flex-col overflow-scroll rounded-xl border shadow-xl"
			// onSubmit={onSubmit}
		>
			<div className="bg-muted flex items-center justify-between px-6 py-4">
				<Input
					// @ts-ignore
					size="sm"
					iconLeft={<SearchIcon className="size-4" />}
					label="Search"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
				<VolunteersSelect />
			</div>

			<div className="border-input-border flex justify-between border-t px-4 py-3">
				<div className="flex items-center gap-4">
					<Avatar
						imageProps={{
							src: '',
						}}
						size="sm"
					>
						Ivan Horvat
					</Avatar>
					<p>Ivan Horvat</p>
				</div>
				<div className="flex items-center gap-8">
					<p className="text-muted-foreground ml-auto text-sm">Organizator</p>
					<Button
						size="xs"
						variant="outline"
						colorScheme="destructive"
						isFullyRounded
					>
						Ban{' '}
					</Button>
				</div>
			</div>
		</Form>
	);
});

const VolunteersSelect = () => {
	return (
		<SelectContainer
			defaultValue="all"
			onValueChange={(value) => {}}
			size="sm"
			isProportionalWidth
		>
			<SelectItem value="all">Everyone</SelectItem>
			<SelectItem value="users">Users</SelectItem>
			<SelectItem value="organizators">Organizators</SelectItem>
		</SelectContainer>
	);
};
