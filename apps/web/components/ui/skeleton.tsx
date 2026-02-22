// External packages
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export const Skeleton: React.FC<React.ComponentPropsWithoutRef<'div'>> = ({
	className,
	...props
}) => {
	return (
		<div
			{...props}
			className={twMerge('bg-muted/20 animate-pulse rounded', className)}
		/>
	);
};
