// External packages
import { twMerge } from 'tailwind-merge';

export const InformationContainer: React.FC<
	React.ComponentPropsWithoutRef<'div'> & {
		title?: string;
	}
> = ({
	/* eslint react/prop-types: 0 */
	title,
	children,
	className,
	...rest
}) => {
	return (
		<div
			{...rest}
			className={twMerge(
				'border-input-border mt-6 w-full rounded-lg border p-4 lg:mt-8 lg:p-6',
				className
			)}
		>
			{title && (
				<h4 className="text-background-foreground text-lg font-medium lg:text-xl">
					{title}
				</h4>
			)}
			{children}
		</div>
	);
};
