// External packages
import { twMerge } from 'tailwind-merge';

export const RadioIconVisual: React.FC<
	React.ComponentPropsWithoutRef<'div'>
> = ({ className, ...rest }) => {
	return (
		<div
			{...rest}
			className={twMerge(
				'group-data-[selected]:border-6 border-input-border group-hover:!border-popover group-data-[selected]:border-muted-foreground size-4 cursor-pointer rounded-full border transition-[border] duration-300 lg:size-6',
				className
			)}
		/>
	);
};

export const RadioButtonVisual: React.FC<
	React.ComponentPropsWithoutRef<'div'> & {
		titleLabel: React.ReactNode | string;
	}
> = ({ titleLabel, children, className, ...rest }) => {
	return (
		<div
			{...rest}
			className={twMerge(
				'border-input-border hover:!border-popover group-data-[selected]:border-popover bg bg-muted flex h-24 cursor-pointer items-center rounded-2xl border px-6 transition-colors lg:h-28',
				className
			)}
		>
			<div className="flex-1">
				<p className="lg:text-md">{titleLabel}</p>
				<p className="text-muted-foreground w-3/4 text-xs lg:text-sm">
					{children}
				</p>
			</div>
			<RadioIconVisual className="ml-auto" />
		</div>
	);
};
