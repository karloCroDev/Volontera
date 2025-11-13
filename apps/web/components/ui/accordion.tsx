'use client';

// External packages
import * as React from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import { twMerge } from 'tailwind-merge';

export const Accordion: React.FC<
	RadixAccordion.AccordionSingleProps & {
		items: {
			value: string;
			trigger: React.ReactNode;
			contentProps: React.ComponentPropsWithoutRef<'div'> &
				RadixAccordion.AccordionContentProps;
		}[];
	}
> = ({ items, ...rest }) => {
	return (
		<RadixAccordion.Root {...rest}>
			{items.map(({ value, trigger, contentProps }) => (
				<RadixAccordion.Item key={value} value={value}>
					<RadixAccordion.Trigger className="group w-full cursor-pointer">
						{trigger}
					</RadixAccordion.Trigger>
					<RadixAccordion.Content
						{...contentProps}
						className={twMerge(
							'data-[state=closed]:animate-slide-up-collapsible data-[state=open]:animate-slide-down-collapsible overflow-hidden',
							contentProps.className
						)}
					/>
				</RadixAccordion.Item>
			))}
		</RadixAccordion.Root>
	);
};
