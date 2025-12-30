'use client';

// External packages
import * as React from 'react';
import { Label as AriaLabel } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';

export const Label: React.FC<
	React.ComponentPropsWithoutRef<'label'> & {
		isOptional?: boolean;
	}
> = ({ isOptional, className, children, ...rest }) => {
	return (
		<AriaLabel
			{...rest}
			className={twMerge('lg:text-md inline-block', className)}
		>
			{children}
			<span className="text-muted-foreground ml-2 text-sm lg:text-base">{`*${!isOptional ? 'required' : 'optional'}`}</span>
		</AriaLabel>
	);
};
