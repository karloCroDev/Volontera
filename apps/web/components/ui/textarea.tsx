// External packages
import {
	TextArea as AriaTextarea,
	Label,
	TextAreaProps,
} from 'react-aria-components';
import { twJoin, twMerge } from 'tailwind-merge';

// Components
import { getTextFieldBasicStyles } from '@/components/ui/input';

export const Textarea: React.FC<
	React.ComponentPropsWithoutRef<'textarea'> &
		TextAreaProps & {
			label: string;
		}
> = ({ label, className, ...rest }) => {
	return (
		<div className="relative">
			<AriaTextarea
				{...rest}
				className={twMerge(
					getTextFieldBasicStyles,
					'min-h-36 !p-4 py-6',
					className
				)}
				placeholder=""
			/>

			<Label
				className={twJoin(
					'text-muted-foreground absolute left-4 top-8 -z-[1] origin-left -translate-y-[24px] scale-75 transition-transform peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100'
				)}
			>
				{label}
			</Label>
		</div>
	);
};
