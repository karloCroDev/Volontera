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
import { Markdown } from '@tiptap/markdown';

// Components
import { Error } from '@/components/ui/error';
import { TextEditorTooltips } from '@/components/ui/text-editor/text-editor-tooltips';
import {
	DndMapppingImages,
	ImageItemArgs,
} from '@/components/ui/dnd-mapping-images';

// Types
import { UploadImageArgs } from '@repo/schemas/image';

export const TextEditor: React.FC<
	React.ComponentPropsWithoutRef<'div'> & {
		label: string;
		iconsRight?: React.ReactNode;
		error?: string;
		value: string;
		setValue: React.Dispatch<React.SetStateAction<string>>;
		textEditorProps?: React.ComponentPropsWithoutRef<'div'> &
			Omit<EditorContentProps, 'editor'>;
		hasAnImage?: boolean;
		images?: ImageItemArgs;
		setImages?: React.Dispatch<React.SetStateAction<ImageItemArgs>>;
	}
> = ({
	value,
	setValue,
	images,
	setImages,
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
			Markdown,
			CharacterCount.configure({
				limit: 200,
			}),
		],

		content: value,
		onUpdate: ({ editor }) => {
			setValue(editor.getMarkdown());
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

	// Handle the apperance of dnd image
	const [showDndImageUpload, setShowDndImageUpload] = React.useState(false);

	if (!editor) return null;

	return (
		<div
			{...rest}
			className={twMerge(
				'border-input-border rounded-md border p-4 px-4',
				className
			)}
		>
			{showDndImageUpload && images && setImages && (
				<DndMapppingImages
					className="mb-4"
					images={images}
					setImages={setImages}
				/>
			)}

			<TextEditorTooltips
				editor={editor}
				hasAnImage={hasAnImage}
				showDndImageUpload={showDndImageUpload}
				setShowDndImageUpload={setShowDndImageUpload}
			/>
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
							value.length > 0 && '-translate-y-[24px] scale-75'
						)}
					>
						{label}
					</Label>
					<p className="text-muted-foreground text-sm">{charactersCount}/200</p>
				</div>
				{iconsRight}
			</div>

			{error && <Error>{error}</Error>}
		</div>
	);
};
