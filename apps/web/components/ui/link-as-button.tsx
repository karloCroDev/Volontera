// External packages
import Link, { LinkProps } from 'next/link';
import { twJoin, twMerge } from 'tailwind-merge';

export interface AdditionalButtonProps {
	variant?: 'primary' | 'outline' | 'blank' | 'ghost';
	colorScheme?: 'orange' | 'yellow' | 'bland' | 'destructive' | 'success';
	size?: 'xs' | 'sm' | 'md' | 'lg';
	iconLeft?: React.ReactNode;
	iconRight?: React.ReactNode;
	isFullyRounded?: boolean;
	isLoading?: boolean;
}

export const getButtonClassNames = ({
	variant,
	colorScheme,
	size,
	isFullyRounded,
}: {
	size: AdditionalButtonProps['size'];
	colorScheme: AdditionalButtonProps['colorScheme'];
	variant: AdditionalButtonProps['variant'];
	isFullyRounded: AdditionalButtonProps['isFullyRounded'];
}): string =>
	twJoin(
		// Default styles
		'flex w-fit items-center justify-center text-center outline-none transition-[opacity] duration-200 hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer rounded-lg gap-3',

		// Size
		size === 'xs' && 'text-sm px-3 py-1.5',
		size === 'sm' && 'px-4 py-2',
		size === 'md' && 'px-6 py-3',
		size === 'lg' && 'text-md px-8 py-5',

		isFullyRounded && 'rounded-full',

		// Primary varaiant styles
		variant === 'primary' &&
			colorScheme === 'orange' &&
			'bg-primary hover:bg-primary/90 text-background',
		variant === 'primary' &&
			colorScheme === 'yellow' &&
			'bg-accent-foreground hover:bg-accent-foreground/90 text-background',
		variant === 'primary' &&
			colorScheme === 'bland' &&
			'bg-background-foreground text-background hover:bg-gray-foreground/90',
		variant === 'primary' &&
			colorScheme === 'destructive' &&
			'bg-destructive/90 text-white hover:bg-destructive/80',
		variant === 'primary' &&
			colorScheme === 'success' &&
			'bg-success/90 text-white hover:bg-success/80',

		// Outline styles
		variant === 'outline' && 'bg-transparent border',
		variant === 'outline' &&
			colorScheme === 'orange' &&
			'text-primary border-primary',
		variant === 'outline' &&
			colorScheme === 'yellow' &&
			'text-accent-foreground border-accent-foreground',
		variant === 'outline' &&
			colorScheme === 'bland' &&
			'text-muted-foreground border-muted-foreground',
		variant === 'outline' &&
			colorScheme === 'destructive' &&
			'text-destructive border-destructive',
		variant === 'outline' &&
			colorScheme === 'success' &&
			'text-success border-success',

		// Ghost variant styles
		variant === 'ghost' &&
			'backdrop-blur-md transition hover:bg-background-foreground/20 hover:opacity-100 bg-transparent',

		// Blank variant styles
		variant === 'blank' && 'bg-transparent hover:backdrop-blur-2xl px-0 mx-0'
	);

export const LinkAsButton: React.FC<
	React.ComponentPropsWithoutRef<'a'> & LinkProps & AdditionalButtonProps
> = ({
	/* eslint react/prop-types: 0 */
	colorScheme = 'orange',
	variant = 'primary',
	size = 'md',
	isFullyRounded = false,
	iconLeft,
	iconRight,
	children,
	className,
	...rest
}) => (
	<Link
		{...rest}
		className={twMerge(
			getButtonClassNames({ colorScheme, size, isFullyRounded, variant }),
			className
		)}
	>
		{iconLeft}
		{children}
		{iconRight}
	</Link>
);
