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

import { useParams } from 'next/navigation';
import { useRetrieveAllPostsForUser } from '@/hooks/data/user';

export const ListPosts = () => {
	const [open, setOpen] = React.useState(false);

	const params = useParams<{ userId: string }>();
	const { data } = useRetrieveAllPostsForUser(params.userId, {
		// Samo kada su otvorene, da ne bi odmah fetchao na loadu stranice
		enabled: open,
	});

	return (
		<InformationContainer>
			<Collapsible
				open={open}
				onOpenChange={setOpen}
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
						<div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-2">
							{data && data.posts.length > 0 ? (
								data.posts.map((post) => <Post key={post.id} post={post} />)
							) : (
								<p className="text-muted-foreground col-span-2 text-center">
									This user has not made any posts.
								</p>
							)}
						</div>
					),
				}}
			/>
		</InformationContainer>
	);
};
