'use client';

// External packages
import Link from 'next/link';
import * as React from 'react';

// Components
import { Collapsible } from '@/components/ui/collapsible';
import { InformationContainer } from '@/modules/main/public-profile/information-container';
import { ChevronRight } from 'lucide-react';
import { Button } from 'react-aria-components';

export const ListPosts = () => {
	return (
		<InformationContainer>
			<Collapsible
				trigger={
					<Button className="group flex w-full justify-between outline-none">
						<p className="text-md lg:text-lg">Posts</p>
						<div className="flex items-center justify-center gap-2">
							<p className="text-muted-foreground group-data-[state=open]:hidden">
								See all posts
							</p>
							<p className="text-muted-foreground hidden group-data-[state=open]:block">
								Close all posts
							</p>
							<ChevronRight className="size-4 transition-transform group-data-[state=open]:-rotate-90" />
						</div>
					</Button>
				}
				contentProps={{
					children: <p className="mt-10">Work this time</p>,
				}}
			/>
		</InformationContainer>
	);
};
