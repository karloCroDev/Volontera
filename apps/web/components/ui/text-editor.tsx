'use client';

// External packages
import * as React from 'react';
import { twJoin, twMerge } from 'tailwind-merge';
import {
	EditorContent,
	EditorContentProps,
	useEditor,
	useEditorState,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Label } from 'react-aria-components';
import { CharacterCount } from '@tiptap/extensions';

// Components
import { getTextFieldBasicStyles } from '@/components/ui/input';
import { Error } from '@/components/ui/error';

export const TextEditor: React.FC<
	React.ComponentPropsWithoutRef<'div'> & {
		label: string;
		iconsLeft?: React.ReactNode;
		iconsRight?: React.ReactNode;
		error?: string;
		textEditorProps?: React.ComponentPropsWithoutRef<'div'> &
			EditorContentProps;
	}
> = ({
	label,
	iconsLeft,
	iconsRight,
	error,
	className,
	textEditorProps,
	...rest
}) => {
	const editor = useEditor({
		extensions: [
			StarterKit,
			CharacterCount.configure({
				limit: 200,
			}),
		],
		content: '',

		// Avoding SSR issues
		immediatelyRender: false,
	});
	const { charactersCount } = useEditorState({
		editor,
		selector: (context) => {
			const e = context?.editor;
			const characters = e?.storage?.characterCount?.characters?.() ?? 0;
			const words = e?.storage?.characterCount?.words?.() ?? 0;
			return { charactersCount: characters, wordsCount: words };
		},
	}) ?? { charactersCount: 0, wordsCount: 0 };

	console.log(charactersCount);
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
				<EditorContent
					editor={editor}
					{...textEditorProps}
					className={twJoin(
						'text-editor overflow-x-hidden whitespace-normal break-words py-4',
						textEditorProps?.className
					)}
				/>
				<Label
					className={twJoin(
						'text-muted-foreground absolute left-0 top-6 -z-[1] origin-left -translate-y-1/2 transition-transform',
						charactersCount > 0 && '-translate-y-[24px] scale-75'
					)}
				>
					{label}
				</Label>
				<p className="text-muted-foreground bg-background text-sm">
					{charactersCount}/200
				</p>
			</div>
			{iconsRight}
			{error && <Error>{error}</Error>}
		</div>
	);
};
