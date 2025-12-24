// External packages
import { twMerge } from 'tailwind-merge';

export const Separator: React.FC<React.ComponentPropsWithoutRef<'div'>> = ({
	/* eslint react/prop-types: 0 */
	className,
	...rest
}) => (
	<div {...rest} className={twMerge('flex items-center gap-4', className)}>
		<hr className="bg-input-border h-px w-full border-0" />
		<p className="text-muted-foreground">or</p>
		<hr className="bg-input-border h-px w-full border-0" />
	</div>
);
