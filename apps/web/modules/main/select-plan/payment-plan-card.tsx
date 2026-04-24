// External packages
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

// Components
import { Tag } from '@/components/ui/tag';
import { Container } from '@/components/ui/container';

export const PaymentPlanCard: React.FC<
	React.ComponentPropsWithoutRef<'div'> & {
		title: string;
		price: string;
		duration: string;
		tag?: string;
		reasons: React.ReactNode;
		link?: React.ReactNode;
		variant?: 'primary' | 'secondary';
	}
> = ({
	title,
	price,
	reasons,
	tag,
	link,
	duration,
	variant = 'primary',
	className,
	...rest
}) => {
	return (
		<Container
			{...rest}
			className={twMerge(
				'flex min-h-[500px] min-w-96 flex-1 flex-col rounded-lg px-5 py-7 shadow-none',
				variant === 'secondary' && 'bg-accent border-accent-foreground',
				className
			)}
		>
			<div className="flex justify-between">
				<div>
					<p className="text-lg">{title}</p>

					{duration && (
						<p
							className={
								variant === 'primary'
									? 'text-muted-foreground'
									: 'text-accent-foreground'
							}
						>
							{duration}
						</p>
					)}
				</div>
				<div>
					<p className="text-end text-lg lg:text-2xl">{price}€</p>

					{tag && (
						<Tag
							className="ml-auto mt-2"
							colorScheme={variant === 'primary' ? 'gray' : 'accent'}
							variant={variant === 'primary' ? 'primary' : 'outline'}
						>
							{tag}
						</Tag>
					)}
				</div>
			</div>
			<hr
				className={`my-4 h-px border-0 ${variant === 'primary' ? 'bg-muted-foreground' : 'bg-accent-foreground'}`}
			/>

			<ul className="flex list-disc flex-col gap-2 pl-5 text-sm lg:text-base">
				{reasons}
			</ul>

			{link}
		</Container>
	);
};
