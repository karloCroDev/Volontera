// External packages
import { CheckCheck } from 'lucide-react';
import { twJoin, twMerge } from 'tailwind-merge';

export const Message: React.FC<
	React.ComponentPropsWithoutRef<'div'> & {
		avatar: React.ReactNode;
		date: Date;
		variant?: 'primary' | 'secondary';
	}
> = ({
	/* eslint react/prop-types: 0 */
	avatar,
	date,
	children,
	variant = 'primary',
	className,
	...rest
}) => {
	const hours = new Date(date).getHours().toString().padStart(2, '0');
	const minutes = new Date(date).getMinutes().toString().padStart(2, '0');
	const day = new Date(date).getDate();
	const month = new Date(date).getMonth() + 1;
	const year = new Date(date).getFullYear();
	return (
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
					{/* Must be a (in some places I am handling markdown) */}
					<div
						className={twJoin(
							'items-end rounded-lg border px-5 py-3 text-sm md:text-base',
							variant === 'primary' &&
								'bg-accent text-accent-foreground border-accent-foreground rounded-tl-none',
							variant === 'secondary' &&
								'border-input-border text-background-foreground rounded-tr-none'
						)}
					>
						{children}
					</div>
					<div className="mt-2 flex items-center justify-between">
						<p className="text-muted-foreground text-xs lg:text-sm">
							{`${hours}:${minutes} | ${day}.${month}. ${year}`}
						</p>
						<CheckCheck className="text-muted-foreground size-4" />
					</div>
				</div>
			</div>
		</>
	);
};

export const MessageSkeleton: React.FC<
	React.ComponentPropsWithoutRef<'div'> & {
		variant?: 'primary' | 'secondary';
	}
> = ({ variant = 'primary', className, ...rest }) => {
	return (
		<div
			{...rest}
			className={twMerge(
				'flex w-full animate-pulse gap-4 md:gap-8', // Add animate-pulse for visual effect
				variant === 'secondary' && 'ml-auto flex-row-reverse', // Matches Message positioning
				className
			)}
		>
			{/* 1. Avatar Placeholder */}
			<div className="bg-muted-foreground size-10 rounded-full md:size-12" />

			{/* 2. Content Container (Mimics width and margin/padding of the original) */}
			<div className="md:max-w-3/5 mt-6 w-4/5">
				{/* Message Bubble Placeholder */}
				<div
					className={twMerge(
						'items-end border px-5 py-3 text-sm md:text-base',
						'bg-muted border-input-border rounded-lg border', // Neutral skeleton background
						// Mimic the rounded corners logic
						variant === 'primary' && 'rounded-tl-none',
						variant === 'secondary' && 'rounded-tr-none'
					)}
				>
					<div className={'bg-muted-foreground h-3 w-full rounded'} />
					<div className={'bg-muted-foreground mt-2 h-3 w-11/12 rounded'} />
					<div className={'bg-muted-foreground mt-2 h-3 w-2/3 rounded'} />
				</div>

				{/* Date/Status Placeholder */}
				<div className="mt-2 flex items-center justify-between">
					<div className={'bg-muted-foreground h-3 w-16 rounded'} />{' '}
					{/* Date placeholder */}
					{/* Status icon placeholder (small circle) */}
					<div className="bg-muted-foreground size-4 rounded-full" />
				</div>
			</div>
		</div>
	);
};
