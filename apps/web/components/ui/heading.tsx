// External packages
import { twMerge } from 'tailwind-merge';

export const Heading: React.FC<
	React.ComponentPropsWithoutRef<'div'> & {
		subtitle?: string;
	}
> = ({ subtitle, children, className, ...rest }) => {
	return (
		<div
			{...rest}
			className={twMerge(
				'2xl:text-max my-8 text-lg md:text-xl lg:my-12 lg:text-2xl 2xl:mb-16 2xl:mt-12'
			)}
		>
			<h1>{children}</h1>
			{subtitle && (
				<p className="text-muted-foreground text-xs md:text-sm lg:text-base">
					{subtitle}
				</p>
			)}
		</div>
	);
};
