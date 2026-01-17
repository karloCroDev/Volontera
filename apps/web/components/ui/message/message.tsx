// External packages
import { CheckCheck } from 'lucide-react';
import { twJoin, twMerge } from 'tailwind-merge';

// Lib
import { formatTime } from '@/lib/utils/time-adjustments';
import { DeleteMessageButton } from '@/components/ui/message/delete-message-button';

export const Message: React.FC<
	React.ComponentPropsWithoutRef<'div'> & {
		avatar: React.ReactNode;
		date: Date;
		variant?: 'primary' | 'secondary';
		images?: React.ReactNode;
		deleteAction?: () => void;
	}
> = ({
	/* eslint react/prop-types: 0 */
	avatar,
	date,
	children,
	variant = 'primary',
	deleteAction,
	images,
	className,
	...rest
}) => {
	return (
		<>
			{images}

			<div
				{...rest}
				className={twMerge(
					'group flex gap-4 md:gap-8',
					variant === 'secondary' && 'ml-auto flex-row-reverse',

					className
				)}
			>
				{avatar}

				<div className="md:max-w-3/5 mt-6 w-4/5">
					{/* Must be a (in some places I am handling markdown) */}
					<div
						className={twJoin(
							'w-full items-end rounded-lg border px-5 py-3 text-sm shadow-lg md:text-base',
							variant === 'primary' &&
								'bg-accent text-accent-foreground border-accent-foreground rounded-tl-none',
							variant === 'secondary' &&
								'border-input-border text-background-foreground bg-muted rounded-tr-none'
						)}
					>
						<div className="prose prose-custom !max-w-full">{children}</div>
					</div>
					<div className="mt-2 flex items-center justify-between">
						<p className="text-muted-foreground text-xs lg:text-sm">
							{formatTime(date)}
						</p>
						<CheckCheck className="text-muted-foreground size-4" />
					</div>
				</div>

				{variant === 'primary' && deleteAction && (
					<DeleteMessageButton action={deleteAction} />
				)}
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
				'flex w-full animate-pulse gap-4 md:gap-8',
				variant === 'secondary' && 'ml-auto flex-row-reverse',
				className
			)}
		>
			<div className="bg-muted-foreground size-10 rounded-full md:size-12" />

			<div className="md:max-w-3/5 mt-6 w-4/5">
				{/* Message Bubble Placeholder */}
				<div
					className={twMerge(
						'items-end border px-5 py-3 text-sm md:text-base',
						'bg-muted border-input-border rounded-lg border',
						variant === 'primary' && 'rounded-tl-none',
						variant === 'secondary' && 'rounded-tr-none'
					)}
				>
					<div className="bg-muted-foreground h-3 w-full rounded" />
					<div className="bg-muted-foreground mt-2 h-3 w-11/12 rounded" />
					<div className="bg-muted-foreground mt-2 h-3 w-2/3 rounded" />
				</div>

				<div className="mt-2 flex items-center justify-between">
					<div className="bg-muted-foreground h-3 w-16 rounded" />
					<div className="bg-muted-foreground size-4 rounded-full" />
				</div>
			</div>
		</div>
	);
};
