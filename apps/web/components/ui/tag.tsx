// External packages
import { twJoin, twMerge } from 'tailwind-merge';
import Link, { LinkProps } from 'next/link';

type SharedTagProps = {
	variant?: 'primary' | 'outline';
	colorScheme?: 'red' | 'green' | 'gray' | 'accent';
};

const sharedTagStyles = ({ variant, colorScheme }: SharedTagProps) =>
	twJoin(
		'w-fit rounded-full border px-3 py-1.5 text-sm',

		// Primary varaiant styles
		variant === 'primary' &&
			colorScheme === 'accent' &&
			'bg-accent/60 border-accent',
		variant === 'primary' &&
			colorScheme === 'gray' &&
			'bg-muted border-input-border',
		variant === 'primary' &&
			colorScheme === 'green' &&
			'bg-success/60 border-success',
		variant === 'primary' &&
			colorScheme === 'red' &&
			'bg-destructive/60 border-destructive',

		// Outline styles
		variant === 'outline' &&
			colorScheme === 'accent' &&
			'text-accent-foreground border-accent-foreground',
		variant === 'outline' &&
			colorScheme === 'gray' &&
			'text-background-foreground border-backtext-background-foreground',
		variant === 'outline' &&
			colorScheme === 'green' &&
			'text-success border-success',
		variant === 'outline' &&
			colorScheme === 'red' &&
			'text-destructive border-destructive'
	);

export const Tag: React.FC<
	React.ComponentPropsWithoutRef<'div'> & SharedTagProps
> = ({
	/* eslint react/prop-types: 0 */
	variant = 'primary',
	colorScheme = 'gray',
	className,
	...rest
}) => (
	<div
		{...rest}
		className={twMerge(sharedTagStyles({ variant, colorScheme }), className)}
	/>
);

export const LinkAsTag: React.FC<
	React.ComponentPropsWithoutRef<'a'> & LinkProps & SharedTagProps
> = ({ variant = 'primary', colorScheme = 'gray', className, ...rest }) => {
	return (
		<Link
			{...rest}
			className={twMerge(
				sharedTagStyles({ variant, colorScheme }),
				'transition-opacity hover:opacity-80',
				className
			)}
		/>
	);
};
