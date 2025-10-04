'use client';

// External packages
import * as React from 'react';
import { Label as AriaLabel } from 'react-aria-components';
export const Label: React.FC<
	React.ComponentPropsWithoutRef<'label'> & {
		children: string;
		isOptional?: boolean;
	}
> = ({ isOptional, className, children, ...rest }) => {
	return (
		<AriaLabel {...rest} className="lg:text-md">
			{children}{' '}
			<span className="text-muted-foreground ml-2 text-sm lg:text-base">{`*${!isOptional ? 'required' : 'optional'}`}</span>
		</AriaLabel>
	);
};
