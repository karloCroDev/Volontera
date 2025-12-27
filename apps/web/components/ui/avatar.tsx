// External packages
import * as RadixAvatar from '@radix-ui/react-avatar';
import { twJoin, twMerge } from 'tailwind-merge';
import { Pen } from 'lucide-react';

export const Avatar: React.FC<
	React.ComponentPropsWithoutRef<'div'> & {
		imageProps: RadixAvatar.AvatarImageProps;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'full';
		isInput?: boolean;
		deleteButton?: React.ReactNode;
		colorScheme?: 'black' | 'gray' | 'orange' | 'yellow';
	}
> = ({
	/* eslint react/prop-types: 0 */
	colorScheme = 'gray',
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
				size === 'xs' && 'size-6',
				size === 'sm' && 'size-8',
				size === 'md' && 'size-10',
				size === 'lg' && 'text-md size-14',
				size === 'xl' && 'size-18 text-lg',
				size === '2xl' && 'size-32 text-2xl',
				size === '4xl' && 'size-40 text-2xl',
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
					colorScheme === 'gray' && 'text-background bg-secondary-background',
					colorScheme === 'black' && 'bg-muted text-background-foreground',
					colorScheme === 'orange' && 'bg-primary text-background',
					colorScheme === 'yellow' && 'bg-accent text-background-foreground'
				)}
				delayMs={500}
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
