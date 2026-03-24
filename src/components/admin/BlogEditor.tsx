'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Markdown, type MarkdownStorage } from 'tiptap-markdown'
import { BlogEditorToolbar } from '@/src/components/admin/BlogEditorToolbar'

interface BlogEditorProps {
  content?: string
  onChange?: (markdown: string) => void
  placeholder?: string
}

export const BlogEditor = ({
  content = '',
  onChange,
  placeholder = '블로그 내용을 작성하세요...',
}: BlogEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-sky-500 underline underline-offset-2 hover:text-sky-600',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Markdown.configure({
        html: false,
        tightLists: true,
        transformPastedText: true,
        transformCopiedText: false,
      }),
    ],
    immediatelyRender: false,
    content,
    onUpdate: ({ editor: updatedEditor }) => {
      const storage = updatedEditor.storage as unknown as Record<string, unknown>
      const markdownStorage = storage['markdown'] as MarkdownStorage | undefined
      const markdown = markdownStorage?.getMarkdown() ?? updatedEditor.getText()
      onChange?.(markdown)
    },
  })

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
      <BlogEditorToolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose prose-sm sm:prose dark:prose-invert max-w-none px-4 py-3 focus-within:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[300px] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-zinc-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0"
      />
    </div>
  )
}
