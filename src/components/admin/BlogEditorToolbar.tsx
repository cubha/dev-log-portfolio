'use client'

import { type Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Code2,
  Link,
  List,
  ListOrdered,
  Quote,
  Minus,
  Heading2,
  Heading3,
} from 'lucide-react'

interface BlogEditorToolbarProps {
  editor: Editor | null
}

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  title: string
  children: React.ReactNode
}

const ToolbarButton = ({ onClick, isActive, title, children }: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-1.5 rounded transition-colors ${
      isActive
        ? 'bg-[var(--surface)] text-[var(--accent)]'
        : 'text-muted hover:bg-[var(--surface)] hover:text-[var(--fg)]'
    }`}
  >
    {children}
  </button>
)

const Divider = () => (
  <div className="w-px h-5 mx-0.5" style={{ background: 'var(--border)' }} />
)

export const BlogEditorToolbar = ({ editor }: BlogEditorToolbarProps) => {
  if (!editor) return null

  const handleLink = () => {
    const previousUrl = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('링크 URL 입력', previousUrl ?? '')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
      {/* 제목 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title="제목 2"
      >
        <Heading2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        title="제목 3"
      >
        <Heading3 size={16} />
      </ToolbarButton>

      <Divider />

      {/* 텍스트 서식 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="굵게 (Ctrl+B)"
      >
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="기울임 (Ctrl+I)"
      >
        <Italic size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="취소선"
      >
        <Strikethrough size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        title="인라인 코드"
      >
        <Code size={16} />
      </ToolbarButton>

      <Divider />

      {/* 코드블록 & 링크 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
        title="코드 블록"
      >
        <Code2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={handleLink}
        isActive={editor.isActive('link')}
        title="링크 삽입"
      >
        <Link size={16} />
      </ToolbarButton>

      <Divider />

      {/* 리스트 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="순서 없는 목록"
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="순서 있는 목록"
      >
        <ListOrdered size={16} />
      </ToolbarButton>

      <Divider />

      {/* 인용 & 구분선 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        title="인용"
      >
        <Quote size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="구분선"
      >
        <Minus size={16} />
      </ToolbarButton>
    </div>
  )
}
