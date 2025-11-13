'use client';

// External pakcages
import * as React from 'react';
import { Checkbox, Form } from 'react-aria-components';

// Components
import { Button } from '@/components/ui/button';
import { CheckboxVisually, CheckboxWithLabel } from '@/components/ui/checkbox';
import { Avatar } from '@/components/ui/avatar';
import Link from 'next/link';
import { Accordion } from '@/components/ui/accordion';
import { ChevronDown } from 'lucide-react';

export const NotificationSandbox = () => {
	return (
		<Form className="border-input-border min-h-1/2 max-h-3/4 overflow-scroll rounded-xl border py-4">
			<div className="mb-4 flex items-center justify-between px-6">
				<CheckboxWithLabel
					checkboxVisuallyProps={{
						size: 'lg',
					}}
				>
					Select all
				</CheckboxWithLabel>
				<Button colorScheme="destructive" size="sm" isFullyRounded>
					Delete
				</Button>
			</div>

			<Accordion
				defaultValue="item-0"
				type="single"
				items={Array.from({ length: 10 }, (_, i) => ({
					value: `item-${i}`,
					trigger: (
						<div className="border-input-border flex w-full items-center gap-4 border-t px-6 py-3 lg:gap-6">
							<Checkbox className="group">
								<CheckboxVisually variant="secondary" />
							</Checkbox>

							<Link href="/" className="flex items-center gap-4">
								<Avatar
									size="sm"
									imageProps={{
										src: '',
									}}
								>
									Ivan Horvat
								</Avatar>

								<p className="text-muted-foreground text-sm underline-offset-2 hover:underline">
									Ivan Horvat
								</p>
							</Link>

							<ChevronDown className="ml-auto transition-transform duration-300 group-data-[state=closed]:rotate-0 group-data-[state=open]:rotate-180" />
						</div>
					),
					contentProps: {
						children: (
							<div className="p-4">
								<p>
									Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum
									culpa consectetur atque vero laboriosam, dolore, alias
									doloremque laudantium eos illo ex, ab consequuntur nesciunt
									voluptas. Similique ducimus vero temporibus amet?
								</p>
							</div>
						),
					},
				}))}
			/>
		</Form>
	);
};
