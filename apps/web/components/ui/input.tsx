'use client';

// External packages
import * as React from 'react';
import {
	Input as AriaInput,
	InputProps as AriaProps,
	Label,
} from 'react-aria-components';
import { twJoin, twMerge } from 'tailwind-merge';

// Components
import { Error } from '@/components/ui/error';

export const getTextFieldBasicStyles =
	'border-input-border data-[invalid]:border-destructive hover:border-popover  text-background-foreground focus:border-popover peer h-14 w-full rounded-md border outline-none transition-[border] placeholder-shown:pt-0';

export type InputProps = React.ComponentPropsWithoutRef<'input'> & {
	label: string;
	error?: string;
	inputProps?: React.ComponentPropsWithoutRef<'input'> & AriaProps;
	size?: 'sm' | 'md';
	iconLeft?: React.ReactNode;
	iconRight?: React.ReactNode;
};

export const Input: React.FC<InputProps> = ({
	label,
	error,
	size = 'md',
	inputProps,
	iconLeft,
	iconRight,
	className,
	...rest
}) => {
	return (
		<>
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
						'text-muted-foreground pointer-events-none absolute top-1/2 z-0 flex origin-left scale-75 items-center gap-2 transition-transform peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100',
						size === 'sm' && 'left-3 -translate-y-[22px]',
						size === 'md' && 'left-4 -translate-y-[24px]'
					)}
				>
					{iconLeft}
					{label}
					{iconRight}
				</Label>
			</div>

			{error && (
				<Error className={size === 'sm' ? 'mt-1.5 text-xs' : 'text-sm'}>
					{error}
				</Error>
			)}
		</>
	);
};
