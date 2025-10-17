'use client';

// External packages
import * as React from 'react';
import { Input as AriaInput, InputProps, Label } from 'react-aria-components';
import { twJoin, twMerge } from 'tailwind-merge';

export const getTextFieldBasicStyles =
	'border-input-border data-[invalid]:border-destructive hover:border-popover text-background-foreground focus:border-popover peer h-14 w-full rounded-md border outline-none transition-[border] placeholder-shown:pt-0';

export const Input: React.FC<
	React.ComponentPropsWithoutRef<'div'> & {
		label: string;
		error?: string;
		inputProps?: React.ComponentPropsWithoutRef<'input'> & InputProps;
		size?: 'sm' | 'md';
	}
> = ({ label, error, size = 'md', inputProps, className, ...rest }) => {
	return (
		<div>
			<div
				{...rest}
				className={twMerge('relative', size === 'sm' && 'text-sm', className)}
			>
				<AriaInput
					{...inputProps}
					className={twMerge(
						getTextFieldBasicStyles,
						size === 'sm' && 'h-12 px-3 pt-2',
						size === 'md' && 'h-14 px-4 pt-3',
						inputProps?.className
					)}
					placeholder=""
				/>
				<Label
					className={twJoin(
						'text-muted-foreground absolute top-1/2 -z-[1] origin-left scale-75 transition-transform peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100',
						size === 'sm' && 'left-3 -translate-y-[22px]',
						size === 'md' && 'left-4 -translate-y-[24px]'
					)}
				>
					{label}
				</Label>
			</div>

			{error && (
				<p
					className={twJoin(
						'text-destructive mt-1.5',
						size === 'sm' ? 'text-xs' : 'text-sm'
					)}
				>
					{error}
				</p>
			)}
		</div>
	);
};
