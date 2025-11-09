// External packages
import { twJoin, twMerge } from 'tailwind-merge';

// Components
import { Tag } from '@/components/ui/tag';
import { AnchorAsButton } from '@/components/ui/anchor-as-button';

export const PaymentPlanCard: React.FC<
	React.ComponentPropsWithoutRef<'div'> & {
		title: string;
		duration: string;
		reasons: React.ReactNode;
		tag?: React.ReactNode;
		variant?: 'primary' | 'secondary';
	}
> = ({ title, reasons, duration, variant = 'primary', className, ...rest }) => {
	return (
		<div
			{...rest}
			className={twMerge(
				'flex-1 rounded-lg border px-5 py-7',
				variant === 'primary' && 'border-input-border bg-muted',
				variant === 'secondary' && 'bg-accent border-accent-foreground'
			)}
		>
			<div className="flex justify-between">
				<div>
					<p className="lg:text-lg">{title}</p>

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
					<p className="text-end text-lg lg:text-2xl">0€</p>
					<Tag
						className="mt-2"
						colorScheme={variant === 'primary' ? 'gray' : 'accent'}
						variant={variant === 'primary' ? 'primary' : 'outline'}
					>
						Popular
					</Tag>
				</div>
			</div>
			<hr
				className={`my-4 h-px border-0 ${variant === 'primary' ? 'bg-muted-foreground' : 'bg-accent-foreground'}`}
			/>

			<ul className="list-disc pl-5 text-sm lg:text-base">{reasons}</ul>

			{/* TODO: Get the url from the stripe */}
			<AnchorAsButton
				className="mt-6 w-full"
				size="md"
				variant={variant === 'primary' ? 'primary' : 'outline'}
				colorScheme={variant === 'primary' ? 'yellow' : 'orange'}
			>
				Current plan
			</AnchorAsButton>
		</div>
	);
};
