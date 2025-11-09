'use client';

// External packages
import * as React from 'react';
import { Textarea, TextAreaProps } from '@/components/ui/textarea';
import { twMerge } from 'tailwind-merge';

export const ResizableTextArea: React.FC<TextAreaProps> = ({
	className,
	onChange,
	...rest
}) => {
	const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

	const adjustTextareaHeight = () => {
		if (!textareaRef.current) return;

		const lineCount = textareaRef.current.value.split('\n').length;

		console.log(lineCount);
		const lineHeight = 32;
		const newHeight = lineCount * lineHeight;
		textareaRef.current.style.height = `${newHeight}px`;
	};
	return (
		<Textarea
			{...rest}
			className={twMerge('max-h-36 min-h-20 resize-none', className)}
			ref={textareaRef}
			onChange={(e) => {
				adjustTextareaHeight();

				if (onChange) onChange(e);
			}}
		/>
	);
};
