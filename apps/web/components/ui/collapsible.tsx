'use client';

// External packages
import * as React from 'react';
import * as RadixCollapsible from '@radix-ui/react-collapsible';
import { twMerge } from 'tailwind-merge';

export const Collapsible: React.FC<
	RadixCollapsible.CollapsibleProps & {
		trigger: React.ReactNode;
		contentProps: React.ComponentPropsWithoutRef<'div'> &
			RadixCollapsible.CollapsibleContentProps;
	}
> = ({ contentProps, trigger, ...rest }) => {
	return (
		<RadixCollapsible.Root {...rest}>
			<RadixCollapsible.Trigger asChild>{trigger}</RadixCollapsible.Trigger>
			<RadixCollapsible.Content
				{...contentProps}
				className={twMerge(
					'data-[state=closed]:animate-slide-up-collapsible data-[state=open]:animate-slide-down-collapsible overflow-hidden',
					contentProps.className
				)}
			/>
		</RadixCollapsible.Root>
	);
};
