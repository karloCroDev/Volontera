// External packages
import { Loader } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export const Spinner: React.FC<
	React.ComponentPropsWithoutRef<'svg'> & {
		size?: 'sm' | 'md' | 'lg';
	}
> = ({
	/* eslint react/prop-types: 0 */
	size = 'md',
	className,
	...rest
}) => {
	return (
		<Loader
			{...rest}
			className={twMerge(
				'animate-spin',
				size === 'sm' && 'size-6',
				size === 'md' && 'size-8',
				size === 'lg' && 'size-12',
				className
			)}
		/>
	);
};
