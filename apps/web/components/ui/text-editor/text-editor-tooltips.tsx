'use client';

// External packages
import {
	Bold,
	CaseLower,
	Heading1,
	Heading2,
	Italic,
	Link,
	List,
	ListOrdered,
	Strikethrough,
	Underline,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Editor as EditorArgs } from '@tiptap/react';

export const TextEditorTooltips: React.FC<{
	editor: EditorArgs;
}> = ({ editor }) => {
	return (
		<div className="border-input-border mb-1 flex items-center gap-3 overflow-x-scroll border-b pb-2">
			<Button
				variant="blank"
				className={
					!editor.isActive('heading', { level: 2 })
						? 'text-muted-foreground p-0'
						: 'p-2'
				}
				onPress={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
			>
				<Heading1 className="size-5" />
			</Button>
			<Button
				variant="blank"
				className={
					!editor.isActive('heading', { level: 3 })
						? 'text-muted-foreground p-0'
						: 'p-2'
				}
				onPress={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
			>
				<Heading2 className="size-5" />
			</Button>

			<div className="bg-input-border h-6 w-px" />
			<Button
				variant="blank"
				className={
					!editor.isActive('bold') ? 'text-muted-foreground p-0' : 'p-2'
				}
				onPress={() => editor.chain().focus().toggleBold().run()}
			>
				<Bold className="size-5" />
			</Button>
			<Button
				variant="blank"
				className={
					!editor.isActive('italic') ? 'text-muted-foreground p-0' : 'p-2'
				}
				onPress={() => editor.chain().focus().toggleItalic().run()}
			>
				<Italic className="size-5" />
			</Button>
			<Button
				variant="blank"
				className={
					!editor.isActive('underline') ? 'text-muted-foreground p-0' : 'p-2'
				}
				onPress={() => editor.chain().focus().toggleUnderline().run()}
			>
				<Underline className="size-5" />
			</Button>
			<Button
				variant="blank"
				className={
					!editor.isActive('strike') ? 'text-muted-foreground p-0' : 'p-2'
				}
				onPress={() => editor.chain().focus().toggleStrike().run()}
			>
				<Strikethrough className="size-5" />
			</Button>
			<Button
				variant="blank"
				className={
					!editor.isActive('link') ? 'text-muted-foreground p-0' : 'p-2'
				}
				onPress={() => editor.chain().focus().toggleLink().run()}
			>
				<Link className="size-5" />
			</Button>
			<div className="bg-input-border h-6 w-px" />
			<Button
				variant="blank"
				className={
					!editor.isActive('bulletList') ? 'text-muted-foreground p-0' : 'p-2'
				}
				onPress={() => editor.chain().focus().toggleBulletList().run()}
			>
				<List className="size-5" />
			</Button>
			<Button
				variant="blank"
				className={
					!editor.isActive('orderedList') ? 'text-muted-foreground p-0' : 'p-2'
				}
				onPress={() => editor.chain().focus().toggleOrderedList().run()}
			>
				<ListOrdered className="size-5" />
			</Button>
		</div>
	);
};
