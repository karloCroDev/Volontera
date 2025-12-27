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
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';

// Components
import { Error } from '@/components/ui/error';

import { TextEditorTooltips } from '@/components/ui/text-editor/text-editor-tooltips';

export const TextEditor: React.FC<
	React.ComponentPropsWithoutRef<'div'> & {
		label: string;
		iconsRight?: React.ReactNode;
		error?: string;
		value: string;
		setValue: React.Dispatch<React.SetStateAction<string>>;
		textEditorProps?: React.ComponentPropsWithoutRef<'div'> &
			EditorContentProps;
		hasAnImage?: boolean;
	}
> = ({
	value,
	setValue,
	label,
	iconsRight,
	error,
	className,
	textEditorProps,
	hasAnImage = false,
	...rest
}) => {
	React.useEffect(() => {
		if (value === '') {
			editor?.commands.clearContent();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);
	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			Image,
			CharacterCount.configure({
				limit: 200,
			}),
		],

		content: value,
		onUpdate: ({ editor }) => {
			setValue(editor.getHTML());
		},
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

	if (!editor) return null;
	return (
		<div
			{...rest}
			className={twMerge(
				'border-input-border rounded-md border p-4 px-4',
				className
			)}
		>
			<TextEditorTooltips editor={editor} hasAnImage={hasAnImage} />
			<div className="flex w-full items-end">
				<div className="relative flex-1">
					<EditorContent
						editor={editor}
						{...textEditorProps}
						className={twJoin(
							'text-editor prose prose-custom not-prose-p: !m-0 max-w-full overflow-x-scroll overflow-y-scroll py-4',
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
		</div>
	);
};
