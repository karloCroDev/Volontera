'use client';

// External packages
import * as React from 'react';

// Components
import { Avatar } from '@/components/ui/avatar';
import { FilledInput } from '@/components/ui/filled-input';
import { Input } from '@/components/ui/input';
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';
import { LinkAsButton } from '@/components/ui/link-as-button';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Tag } from '@/components/ui/tag';
import { SidebarItem } from '@/components/ui/sidebar/sidebar-items';
import { Textarea } from '@/components/ui/textarea';
import { AdditionalInformationForm } from '@/modules/onboarding/additional-information-form';
import { Volontera } from '@/components/ui/volonotera';
import { PostSkeleton } from '@/components/ui/post/post-skeleton';

// Lib
import { toast } from '@/lib/utils/toast';
import { HomePostsMapping } from '@/modules/main/home/home-posts-mapping';
import { SelectContainer, SelectItem } from '@/components/ui/select';

export default function PlaygroundPage() {
	return (
		<div>
			<div className="m-20">
				<Volontera />
			</div>

			<div className="ml-40">
				<SelectContainer>
					<SelectItem value="option-1">Option1 </SelectItem>
					<SelectItem value="option-2">Option 2</SelectItem>
					<SelectItem value="option-3">Option 3</SelectItem>
					<SelectItem value="option-4">Option 4</SelectItem>
				</SelectContainer>
			</div>

			<p>Hello world</p>
			<LinkAsButton href="/playground" colorScheme="bland" variant="blank">
				Button
			</LinkAsButton>
			<Button variant="blank">ss</Button>
			<Button variant="ghost">ss</Button>
			<button className="rounded-md px-4 py-2 text-white backdrop-blur-md transition hover:bg-white/20">
				Ghost Button
			</button>

			<Layout className="gap-4">
				{[...Array(6)].map((_, indx) => (
					<LayoutColumn
						key={indx}
						start={{
							base:
								(indx % 3 === 0 && 1) ||
								(indx % 3 === 1 && 5) ||
								(indx % 3 === 2 && 9) ||
								undefined,
						}}
						end={{
							base:
								(indx % 3 === 0 && 5) ||
								(indx % 3 === 1 && 9) ||
								(indx % 3 === 2 && 13) ||
								undefined,
						}}
						className="h-20 bg-blue-400"
					>
						<p>Hello world</p>
					</LayoutColumn>
				))}
			</Layout>
			<Input label="Enter your username..." className="w-96" />
			<Input label="Enter your username..." className="mt-4 w-96" />
			<FilledInput placeholderValue="username" className="w-96" />
			<FilledInput placeholderValue="surname" className="w-96" size="sm" />
			<Avatar
				size="full"
				isInput
				imageProps={
					{
						// alt: 'Example avatar',
						// src: 'https://media.istockphoto.com/id/1316134499/photo/a-concept-image-of-a-magnifying-glass-on-blue-background-with-a-word-example-zoom-inside-the.jpg?s=612x612&w=0&k=20&c=sZM5HlZvHFYnzjrhaStRpex43URlxg6wwJXff3BE9VA=',
					}
				}
			>
				Ana Horvat
			</Avatar>
			<Separator />
			<div className="animate-in fade-in">Hello </div>
			<Button
				onPress={() => {
					console.log('Hello world');
					toast({
						title: 'Hello world',
						content: 'What ',
						variant: 'success',
					});
				}}
			>
				click me{' '}
			</Button>
			<Dialog
				triggerChildren={<Button>Open Dialog</Button>}
				title="Hello world"
				subtitle="What is going on"
			>
				Hello world
			</Dialog>
			<Tag variant="primary" colorScheme="accent">
				{' '}
				Hello wolrd
			</Tag>
			<Tag> Hello wolrd</Tag>
			<SidebarItem isSelected>Cool</SidebarItem>
			<SidebarItem>Cool</SidebarItem>
			<Textarea label="sss" />
			<AdditionalInformationForm />

			<div className="size-80">
				<PostSkeleton />
			</div>

			<div
				className="h-96 w-96 overflow-x-hidden overflow-y-scroll"
				id="x-scroll"
			>
				<HomePostsMapping />
			</div>
		</div>
	);
}
