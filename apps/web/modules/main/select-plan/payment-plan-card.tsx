// External packages
import { twMerge } from 'tailwind-merge';

// Components
import { Tag } from '@/components/ui/tag';

export const PaymentPlanCard: React.FC<
	React.ComponentPropsWithoutRef<'div'> & {
		title: string;
		price: string;
		duration: string;
		tag?: string;
		reasons: React.ReactNode;
		link: React.ReactNode;
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
		<div
			{...rest}
			className={twMerge(
				'flex h-[500px] min-w-96 flex-1 flex-col rounded-lg border px-5 py-7',
				variant === 'primary' && 'border-input-border bg-muted',
				variant === 'secondary' && 'bg-accent border-accent-foreground'
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

			{/* TODO: Get the url from the stripe */}
			{link}
		</div>
	);
};
