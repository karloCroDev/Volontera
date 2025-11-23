'use client';

// External packages
import * as React from 'react';
import { Textarea, TextAreaProps } from '@/components/ui/textarea';
import { twMerge } from 'tailwind-merge';

export const ResizableTextArea: React.FC<TextAreaProps> = ({
	textAreaProps,
	className,
	...rest
}) => {
	const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

	const adjustTextareaHeight = () => {
		if (!textareaRef.current) return;

		const lineCount = textareaRef.current.value.split('\n').length;

		const lineHeight = 32;
		const newHeight = lineCount * lineHeight - 1;
		textareaRef.current.style.height = `${57 + newHeight}px`;
	};
	return (
		<Textarea
			{...rest}
			ref={textareaRef}
			className={twMerge('lg:max-w-3/4 mx-auto', className)}
			textAreaProps={{
				...textAreaProps,
				onChange: (e) => {
					adjustTextareaHeight();

					if (textAreaProps?.onChange) {
						textAreaProps.onChange(e);
					}
				},
				className: twMerge('!min-h-10 !max-h-60 ', textAreaProps?.className),
			}}
		/>
	);
};
