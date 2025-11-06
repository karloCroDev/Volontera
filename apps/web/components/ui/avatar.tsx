// External packages
import * as RadixAvatar from '@radix-ui/react-avatar';
import { twJoin, twMerge } from 'tailwind-merge';
import { Pen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Avatar: React.FC<
	React.ComponentPropsWithoutRef<'div'> & {
		imageProps: RadixAvatar.AvatarImageProps;
		size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
		isInput?: boolean;
		deleteButton?: React.ReactNode;
		variant?: 'primary' | 'secondary';
	}
> = ({
	variant = 'primary',
	imageProps,
	size = 'md',
	isInput = false,
	deleteButton,
	children,
	className,
	...rest
}) => (
	<RadixAvatar.Root>
		<div
			{...rest}
			className={twMerge(
				'relative rounded-full',
				size === 'sm' && 'size-6',
				size === 'md' && 'size-8',
				size === 'lg' && 'text-md size-12',
				size === 'xl' && 'size-16 text-lg',
				size === '2xl' && 'size-32 text-2xl',
				size === 'full' && 'size-60 text-3xl',
				isInput && 'cursor-pointer',
				className
			)}
		>
			<RadixAvatar.Image
				{...imageProps}
				alt={imageProps?.alt || 'Representation of users profile picture'}
				className={twMerge(
					'size-full rounded-full object-cover',
					imageProps.className
				)}
			/>
			<RadixAvatar.Fallback
				className={twJoin(
					'flex size-full items-center justify-center rounded-full',
					variant === 'secondary'
						? 'text-background bg-secondary-background'
						: 'bg-muted text-background-foreground'
				)}
			>
				{children
					?.toString()
					.split(' ')
					.map((l) => l[0])}
			</RadixAvatar.Fallback>

			{isInput && (
				<div
					className={twJoin(
						'absolute bottom-2 right-0 z-20 flex gap-4',
						!deleteButton ? 'right-2' : 'right-0'
					)}
				>
					<div className="bg-primary text-background rounded-full p-3">
						<Pen className="size-4" />
					</div>

					{deleteButton}
				</div>
			)}
		</div>
	</RadixAvatar.Root>
);
