'use client';

// External packages
import * as React from 'react';
import { Textarea, TextAreaProps } from '@/components/ui/textarea';
import { twMerge } from 'tailwind-merge';

export const ResizableTextArea: React.FC<TextAreaProps> = ({
	className,
	textAreaProps,
	...rest
}) => {
	const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

	const adjustTextareaHeight = () => {
		if (!textareaRef.current) return;

		const lineCount = textareaRef.current.value.split('\n').length;
		const lineHeight = 32;
		const newHeight = lineCount * lineHeight;
		textareaRef.current.style.height = `${newHeight}px`;
	};

	const mergedClassName = twMerge(
		'max-h-36 min-h-24 resize-none',
		textAreaProps?.className,
		className
	);

	return (
		<Textarea
			{...rest}
			textAreaProps={{
				...textAreaProps,
				ref: textareaRef,
				onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
					adjustTextareaHeight();

					if (textAreaProps?.onChange) textAreaProps.onChange(e);
				},
				className: mergedClassName,
			}}
		/>
	);
};
