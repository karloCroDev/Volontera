'use client';

// External packages
import * as React from 'react';
import { Button as AriaButton, ButtonProps } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';

// Components
import {
	AdditionalButtonProps,
	getButtonClassNames,
} from '@/components/ui/link-as-button';
import { Spinner } from '@/components/ui/spinner';

export const Button: React.FC<
	React.ComponentPropsWithoutRef<'button'> & ButtonProps & AdditionalButtonProps
> = ({
	isLoading,
	colorScheme = 'orange',
	variant = 'primary',
	size = 'sm',
	isFullyRounded = false,
	iconLeft,
	iconRight,
	children,
	className,
	...rest
}) => (
	<AriaButton
		{...rest}
		className={twMerge(
			getButtonClassNames({ size, variant, colorScheme, isFullyRounded }),
			className
		)}
	>
		{iconLeft}
		{children}
		{iconRight}
		{isLoading && (
			<Spinner size="sm" className={`${size === 'lg' ? 'ml-4' : 'ml-auto'}`} />
		)}
	</AriaButton>
);
