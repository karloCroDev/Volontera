'use client';

// External packages
import * as React from 'react';
import Link, { LinkProps } from 'next/link';
import { twJoin, twMerge } from 'tailwind-merge';
import { Collapsible } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ButtonProps } from 'react-aria-components';
import { AdditionalButtonProps } from '@/components/ui/link-as-button';
import { ChevronDown } from 'lucide-react';
export const SidebarItem: React.FC<
	React.ComponentPropsWithoutRef<'button'> &
		ButtonProps &
		AdditionalButtonProps & { isSelected?: boolean }
> = ({ isSelected = false, className, ...rest }) => {
	return (
		<Button
			{...rest}
			isFullyRounded={isSelected}
			variant={isSelected ? 'primary' : 'blank'}
			colorScheme={isSelected ? 'orange' : 'bland'}
			className={twMerge(
				isSelected &&
					'text-background-foreground border-input-border bg-muted hover:bg-muted border',
				className
			)}
		/>
	);
};

export const SidebarCollapsible = () => {
	return (
		<Collapsible
			trigger={
				<SidebarItem
					className="group"
					iconRight={
						<ChevronDown className="transition-transform group-data-[state=closed]:rotate-0 group-data-[state=open]:rotate-180" />
					}
				>
					Ajde
				</SidebarItem>
			}
			contentProps={{
				children: <div>Hello world</div>,
			}}
		/>
	);
};
