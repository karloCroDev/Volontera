'use client';

import * as React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { FilledInput } from '@/components/ui/filled-input';
import { Input } from '@/components/ui/input';
import { Layout, LayoutColumn } from '@/components/ui/layout-grid';
import { LinkAsButton } from '@/components/ui/link-as-button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/lib/utils/toast';
import { Button } from '@/components/ui/button';

export default function PlaygroundPage() {
	return (
		<div>
			<p>Hello world</p>

			<LinkAsButton href="/playground" colorScheme="bland" variant="blank">
				Button
			</LinkAsButton>

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
			<Input label="Enter your username..." className="mt-4 w-96" size="sm" />
			<FilledInput placeholderValue="username" label="Karlo" className="w-96" />
			<FilledInput
				placeholderValue="surname"
				label="Grgic"
				className="w-96"
				size="sm"
			/>

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
		</div>
	);
}
