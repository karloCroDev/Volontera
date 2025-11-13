// External packages
import { twJoin, twMerge } from 'tailwind-merge';

export const Message: React.FC<
	React.ComponentPropsWithoutRef<'div'> & {
		avatar: React.ReactNode;
		variant?: 'primary' | 'secondary';
	}
> = ({ avatar, children, variant = 'primary', className, ...rest }) => (
	<div
		{...rest}
		className={twMerge(
			'flex gap-4 md:gap-8',
			variant === 'secondary' && 'ml-auto flex-row-reverse',

			className
		)}
	>
		{avatar}
		<p
			className={twJoin(
				'md:max-w-3/5 mt-6 w-4/5 items-end rounded-lg border px-5 py-3 text-sm md:text-base',
				variant === 'primary' &&
					'bg-accent text-accent-foreground border-accent-foreground rounded-tl-none',
				variant === 'secondary' &&
					'border-input-border text-background-foreground rounded-tr-none'
			)}
		>
			{children}
		</p>
	</div>
);
