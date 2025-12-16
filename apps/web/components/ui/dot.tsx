// External packages
import { twMerge } from 'tailwind-merge';

type DotProps = React.ComponentPropsWithoutRef<'div'> & {
	state?: 'success' | 'pending' | 'destructive';
	size?: 'sm' | 'md' | 'lg';
};

export const Dot: React.FC<DotProps> = ({
	size = 'md',
	state = 'pending',
	className,
	...rest
}) => (
	<div
		{...rest}
		className={twMerge(
			'rounded-full',
			size === 'sm' && 'size-2',
			size === 'md' && 'size-3',
			size === 'lg' && 'size-6',
			state === 'success' && 'bg-success',
			state === 'pending' && 'bg-pending',
			state === 'destructive' && 'bg-destructive',
			className
		)}
	/>
);

export const DotWithLabel: React.FC<
	React.ComponentPropsWithoutRef<'div'> & {
		label: string;
		dotProps?: DotProps;
	}
> = ({ label, dotProps, className, ...rest }) => (
	<div
		{...rest}
		className={twMerge(
			'flex items-center',
			dotProps?.state === 'success' && 'text-success',
			dotProps?.state === 'pending' && 'text-pending',
			dotProps?.state === 'destructive' && 'text-destructive',
			className
		)}
	>
		<Dot {...dotProps} />
		<p className="ml-2">{label}</p>
	</div>
);
