// External packages
import { twMerge } from 'tailwind-merge';

export const Error: React.FC<React.ComponentPropsWithoutRef<'div'>> = ({
	/* eslint react/prop-types: 0 */
	className,
	...rest
}) => (
	<p
		{...rest}
		className={twMerge('text-destructive animate-in mt-2', className)}
	/>
);
