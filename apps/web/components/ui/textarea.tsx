'use client';

// External packages
import {
	TextArea as AriaTextarea,
	Label,
	TextAreaProps as AriaTextareaProps,
} from 'react-aria-components';
import { twMerge } from 'tailwind-merge';

// Components
import { getTextFieldBasicStyles } from '@/components/ui/input';
import { Error } from '@/components/ui/error';

export type TextAreaProps = React.ComponentProps<'textarea'> &
	AriaTextareaProps & {
		label: string;
		iconLeft?: React.ReactNode;
		iconRight?: React.ReactNode;
		error?: string;
	};

export const Textarea: React.FC<TextAreaProps> = ({
	label,
	error,
	iconLeft,
	iconRight,
	className,
	...rest
}) => {
	return (
		<div>
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

				<Label className="text-muted-foreground absolute left-4 top-6 -z-[1] origin-left -translate-y-[24px] scale-75 transition-transform peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100">
					{label}
				</Label>
			</div>

			{error && <Error>{error}</Error>}
		</div>
	);
};
