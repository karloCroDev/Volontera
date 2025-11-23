// External packages
import * as React from 'react';
import { ChevronDown, MessageCircleMore } from 'lucide-react';
import Link from 'next/link';

// Components
import { Avatar } from '@/components/ui/avatar';
import { Collapsible } from '@/components/ui/collapsible';
import { LinkAsButton } from '@/components/ui/link-as-button';

// Modules
import { PostLike } from '@/components/ui/post/post-like';
import { SharePost } from '@/components/ui/post/share-post';

export const Post: React.FC<{
	title: string;
	content: string;
}> = ({ title, content }) => {
	const splittedContent = content.split('.');
	return (
		<div className="border-input-border bg-muted rounded-xl border px-8 py-6">
			<div className="mb-8 flex justify-between">
				<div className="flex items-center gap-4">
					<Avatar
						variant="secondary"
						imageProps={{
							src: '',
						}}
					>
						Organization X
					</Avatar>

					<div>
						<p>Organization X</p>
						<p className="text-muted-foreground text-sm">20 attendees</p>
					</div>
				</div>

				<LinkAsButton href="/home/explore" colorScheme="yellow" size="sm">
					Explore{' '}
				</LinkAsButton>
			</div>
			<h4 className="mb-4 text-lg font-semibold">{title}</h4>
			<Collapsible
				trigger={
					<div className="group cursor-pointer">
						<p className="cursor-pointer italic">{splittedContent[0]}</p>

						<div className="flex items-baseline justify-center gap-4">
							<p className="text-muted-foreground mt-2 text-center group-data-[state=open]:hidden">
								Show more
							</p>
							<ChevronDown className="size-3 group-data-[state=open]:hidden" />
						</div>
					</div>
				}
				contentProps={{
					children: <p>{splittedContent.slice(1).join('.')}</p>,
				}}
			/>

			<div className="rouded-md border-input-border mt-4 aspect-[4/3] rounded border" />

			<div className="mt-6 flex items-center gap-8">
				<p className="text-muted-foreground">
					Written by: <span className="italic">Ivan Horvat, Ana Horvat</span>
				</p>

				<PostLike />
				<Link href="/post/123" className="flex items-center gap-4">
					<MessageCircleMore
						//  fill="#f59f0a" className="text-primary"
						className="text-background-foreground cursor-pointer"
					/>
					<p className="font-semibold italic underline underline-offset-4">
						20
					</p>
				</Link>
				<SharePost link="xx" />
			</div>
		</div>
	);
};
