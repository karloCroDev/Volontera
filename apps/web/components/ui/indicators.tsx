'use client';

// External packages
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export const Indicators: React.FC<React.ComponentPropsWithoutRef<'div'>> = ({
	className,
	...rest
}) => {
	return (
		<p
			{...rest}
			className={twMerge(
				'text-muted-foreground border-input-border ml-2 mt-4 border-b pb-2 text-start text-sm',
				className
			)}
		/>
	);
};
