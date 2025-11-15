// External packages
import { Check, CheckCheck } from 'lucide-react';
import { twJoin, twMerge } from 'tailwind-merge';

export const Message: React.FC<
	React.ComponentPropsWithoutRef<'div'> & {
		avatar: React.ReactNode;
		date: string;
		variant?: 'primary' | 'secondary';
	}
> = ({ avatar, date, children, variant = 'primary', className, ...rest }) => (
	<>
		<div
			{...rest}
			className={twMerge(
				'flex gap-4 md:gap-8',
				variant === 'secondary' && 'ml-auto flex-row-reverse',

				className
			)}
		>
			{avatar}
			<div className="md:max-w-3/5 mt-6 w-4/5">
				<p
					className={twJoin(
						'items-end rounded-lg border px-5 py-3 text-sm md:text-base',
						variant === 'primary' &&
							'bg-accent text-accent-foreground border-accent-foreground rounded-tl-none',
						variant === 'secondary' &&
							'border-input-border text-background-foreground rounded-tr-none'
					)}
				>
					{children}
				</p>
				<div className="mt-2 flex items-center justify-between">
					<p className="text-muted-foreground text-xs lg:text-sm">{date}</p>
					<CheckCheck className="text-muted-foreground size-4" />
				</div>
			</div>
		</div>
	</>
);
