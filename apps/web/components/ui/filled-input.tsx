'use client';

// External packages
import * as React from 'react';
import { Input as AriaInput, InputProps, Label } from 'react-aria-components';
import { twJoin, twMerge } from 'tailwind-merge';
import { Pencil } from 'lucide-react';
import { CircleCheck } from 'lucide-react';
import { Error } from '@/components/ui/error';

export const FilledInput: React.FC<
	React.ComponentPropsWithoutRef<'div'> & {
		placeholderValue: string;
		inputProps?: React.ComponentPropsWithoutRef<'input'> & InputProps;
		size?: 'sm' | 'md';
		error?: string;
	}
> = ({
	placeholderValue,
	size = 'md',
	inputProps,
	className,
	error,
	...rest
}) => {
	return (
		<>
			<div
				{...rest}
				className={twMerge(
					'group relative flex items-center justify-between gap-4',
					size === 'sm' && 'text-sm',
					className
				)}
			>
				<AriaInput
					{...inputProps}
					className={twMerge(
						'border-input-border data-[invalid]:border-destructive group-hover:border-popover text-background-foreground focus:border-popover peer h-14 w-full border-b outline-none transition-[border] placeholder-shown:pt-0',
						size === 'sm' && 'h-12 px-3 pt-2',
						size === 'md' && 'h-14 px-4 pt-3',
						inputProps?.className
					)}
					placeholder=""
				/>
				<Label
					className={twJoin(
						'peer-placeholder-shown:text-background-foreground text-muted-foreground absolute top-1/2 -z-[1] origin-left scale-75 transition-transform peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100',
						size === 'sm' && 'left-3 -translate-y-[22px]',
						size === 'md' && 'left-4 -translate-y-[24px]'
					)}
				>
					{placeholderValue}
				</Label>

				<Pencil
					className={twJoin(
						'peer-placeholder-shown:text-muted-foreground group-hover:text-background-foreground! text-popover hidden cursor-pointer peer-placeholder-shown:block peer-focus:hidden',
						size === 'md' && 'size-4.5',
						size == 'sm' && 'size-3.5'
					)}
				/>
				<CircleCheck
					className={twJoin(
						'text-background-foreground hover:text-popover block cursor-pointer peer-placeholder-shown:hidden peer-focus:block',
						size === 'md' && 'size-6',
						size == 'sm' && 'size-4.5'
					)}
				/>
			</div>

			{error && (
				<Error className={size === 'sm' ? 'mt-1.5 text-xs' : 'text-sm'}>
					{error}
				</Error>
			)}
		</>
	);
};
