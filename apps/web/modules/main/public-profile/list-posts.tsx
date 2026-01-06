'use client';

// External packages
import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from 'react-aria-components';

// Components
import { Collapsible } from '@/components/ui/collapsible';
import { Post } from '@/components/ui/post/post';

// Modules
import { InformationContainer } from '@/modules/main/public-profile/information-container';

// TODO: Fetch this separately so that I don't have to fetch everything in the same fetch
export const ListPosts = () => {
	return (
		<InformationContainer>
			<Collapsible
				trigger={
					<Button className="group flex w-full justify-between outline-none">
						<p className="text-lg lg:text-xl">Posts</p>
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
					children: (
						<div className="my-6">
							<Post content="xxx" title="sss" />
						</div>
					),
				}}
			/>
		</InformationContainer>
	);
};
