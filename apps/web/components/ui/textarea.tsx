'use client';

// External packages
import {
	TextArea as AriaTextarea,
	Label,
	TextAreaProps as AriaTextareaProps,
} from 'react-aria-components';
import { twJoin, twMerge } from 'tailwind-merge';

// Components
import { getTextFieldBasicStyles } from '@/components/ui/input';
import { Error } from '@/components/ui/error';

type TextAreaOnlyProps = React.ComponentProps<'textarea'> & AriaTextareaProps;

export type TextAreaProps = React.ComponentPropsWithoutRef<'div'> & {
	textAreaProps?: TextAreaOnlyProps;
} & {
	label: string;
	iconsLeft?: React.ReactNode;
	iconsRight?: React.ReactNode;
	error?: string;
};

export const Textarea: React.FC<TextAreaProps> = ({
	label,
	iconsLeft,
	iconsRight,
	error,
	textAreaProps,
	className,
	...rest
}) => {
	return (
		<div
			{...rest}
			className={twMerge(
				'border-input-border flex items-end rounded-md border px-4 pb-4',
				className
			)}
		>
			{iconsLeft}
			<div className="relative flex-1">
				<AriaTextarea
					className={twJoin(
						getTextFieldBasicStyles,
						'min-h-36 resize-none border-0 !py-5'
					)}
					placeholder=""
				/>

				<Label className="text-muted-foreground absolute left-0 top-6 -z-[1] origin-left -translate-y-[24px] scale-75 transition-transform peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100">
					{label}
				</Label>
			</div>
			{iconsRight}

			{error && <Error>{error}</Error>}
		</div>
	);
};
