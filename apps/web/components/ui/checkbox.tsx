//External packages
import { Check } from 'lucide-react';
import { Checkbox as AriaCheckbox, CheckboxProps } from 'react-aria-components';
import { twJoin, twMerge } from 'tailwind-merge';

type CheckboxVisuallyProps = React.ComponentPropsWithoutRef<'div'> & {
	variant?: 'primary' | 'secondary' | 'suiccess' | 'destructive';
	size?: 'sm' | 'lg';
};

export const CheckboxVisually: React.FC<CheckboxVisuallyProps> = ({
	variant = 'primary',
	size = 'sm',
	className,
	...rest
}) => {
	return (
		<div
			{...rest}
			className={twMerge(
				'flex cursor-pointer items-center justify-center rounded-md border group-data-[selected]:border-0',
				size === 'sm' && 'size-6',
				size === 'lg' && 'size-8',
				variant === 'primary' &&
					'group-data-[selected]:bg-accent border-accent hover:group-data-[selected]:bg-accent/80 hover:border-accent/80 group-data-[selected]:text-background-foreground',
				variant === 'secondary' &&
					'group-data-[selected]:bg-accent-foreground border-accent-foreground hover:group-data-[selected]:bg-accent-foreground/80 hover:border-accent-foreground/80 group-data-[selected]:text-background',
				variant === 'suiccess' &&
					'group-data-[selected]:bg-success border-success hover:group-data-[selected]:bg-success/80 hover:border-success/80 group-data-[selected]:text-background-foreground',
				variant === 'destructive' &&
					'group-data-[selected]:bg-destructive border-destructive hover:group-data-[selected]:bg-destructive/80 hover:border-destructive/80 group-data-[selected]:text-background-foreground',
				className
			)}
		>
			<Check
				className={twJoin(
					'opacity-0 transition-opacity group-data-[selected]:opacity-100',
					size === 'sm' && 'size-4',
					size === 'lg' && 'size-6'
				)}
			/>
		</div>
	);
};

export const CheckboxWithLabel: React.FC<
	React.ComponentPropsWithoutRef<'label'> &
		CheckboxProps & {
			checkboxVisuallyProps?: CheckboxVisuallyProps;
		}
> = ({ checkboxVisuallyProps, children, className, ...rest }) => {
	const size = checkboxVisuallyProps?.size || 'sm';

	console.log(size);
	return (
		<AriaCheckbox
			{...rest}
			className={twMerge('group flex items-center', className)}
		>
			<CheckboxVisually {...checkboxVisuallyProps} />
			<p
				className={twJoin(
					'group-data-[selected]:font-semibold',
					size === 'lg' && 'text-md ml-4',
					size === 'sm' && 'ml-2'
				)}
			>
				{children}
			</p>
		</AriaCheckbox>
	);
};
