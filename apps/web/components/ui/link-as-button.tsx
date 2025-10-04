// External packages
import Link, { LinkProps } from 'next/link';
import { twJoin, twMerge } from 'tailwind-merge';

// Components
import { Spinner } from '@/components/ui/spinner';

export interface AdditionalButtonProps {
	variant?: 'primary' | 'outline' | 'blank';
	colorScheme?: 'orange' | 'yellow' | 'bland' | 'destructive';
	size?: 'sm' | 'md' | 'lg';
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
		size === 'sm' && 'px-4 py-2',
		size === 'md' && 'px-6 py-3',
		size === 'lg' && 'text-md px-8 py-5',

		// Option to round maximally
		isFullyRounded && 'rounded-full',

		// Blank variant styles
		variant === 'blank' && 'bg-transparent hover:backdrop-blur-2xl',

		// Primary varaiant styles
		variant === 'primary' &&
			colorScheme === 'orange' &&
			'bg-primary hover:bg-primary/90 -background text-background',
		variant === 'primary' &&
			colorScheme === 'yellow' &&
			'bg-accent-foreground hover:bg-accent-foreground/90 text-background',
		variant === 'primary' &&
			colorScheme === 'bland' &&
			'bg-background-foreground text-background hover:bg-gray-foreground/90',

		// Outline styles
		variant === 'outline' && 'bg-background border',
		variant === 'outline' &&
			colorScheme === 'orange' &&
			'text-primary border-primary',
		variant === 'outline' &&
			colorScheme === 'yellow' &&
			'text-accent-foreground border-accent-foreground',
		variant === 'outline' &&
			colorScheme === 'bland' &&
			'text-background-foreground border-background-foreground',
		variant === 'outline' &&
			colorScheme === 'bland' &&
			'text-destructive border-destructive'
	);

export const LinkAsButton: React.FC<
	React.ComponentPropsWithoutRef<'a'> & LinkProps & AdditionalButtonProps
> = ({
	colorScheme = 'orange',
	variant = 'primary',
	size = 'md',
	isFullyRounded = false,
	iconLeft,
	iconRight,
	children,
	className,
	isLoading,
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
		{isLoading && <Spinner size={size} className="ml-auto" />}
	</Link>
);
