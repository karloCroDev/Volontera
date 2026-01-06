'use client';

// External packages
import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from 'react-aria-components';

// Components
import { Collapsible } from '@/components/ui/collapsible';
import { Avatar } from '@/components/ui/avatar';
import { LinkAsButton } from '@/components/ui/link-as-button';

// Modules
import { InformationContainer } from '@/modules/main/public-profile/information-container';

// TODO: Fetch this separately so that I don't have to fetch everything in the same fetch
export const ListOrganizations = () => {
	return (
		<InformationContainer>
			<Collapsible
				trigger={
					<Button className="group flex w-full justify-between outline-none">
						<p className="text-lg lg:text-xl">Organizations</p>
						<div className="flex items-center justify-center gap-2">
							<p className="text-muted-foreground group-data-[state=open]:hidden">
								See all organizations
							</p>
							<p className="text-muted-foreground hidden group-data-[state=open]:block">
								Close all organizations
							</p>
							<ChevronRight className="size-4 transition-transform group-data-[state=open]:-rotate-90" />
						</div>
					</Button>
				}
				contentProps={{
					children: (
						<div className="border-input-border bg-muted mt-4 flex items-center gap-4 rounded-md border px-4 py-3">
							<Avatar
								imageProps={{
									src: '',
								}}
								colorScheme="gray"
							>
								Organization Example
							</Avatar>

							<p className="text-md">Organization Example</p>

							<LinkAsButton
								href="/organizations/organization"
								size="sm"
								className="ml-auto"
							>
								Explore
							</LinkAsButton>
						</div>
					),
				}}
			/>
		</InformationContainer>
	);
};
