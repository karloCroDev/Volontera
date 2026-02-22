// External packages
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export const Container: React.FC<React.ComponentPropsWithoutRef<'div'>> = ({
	className,
	...props
}) => (
	<div
		{...props}
		className={twMerge(
			'border-input-border bg-muted border shadow-lg',
			className
		)}
	/>
);
