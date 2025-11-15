'use client';

import { useState } from 'react';
import { EditorContent, useEditor, EditorContentProps } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Send } from 'lucide-react';

// Components
import { TextEditor } from '@/components/ui/text-editor';
import { Button } from '@/components/ui/button';

export const MessageForm = () => {
	return (
		<TextEditor
			label="Enter your message"
			className="max-w-3/4"
			iconsRight={
				<Button type="submit" className="p-2">
					<Send />
				</Button>
			}
		/>
	);
};
