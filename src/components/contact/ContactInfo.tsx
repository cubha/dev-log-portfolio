'use client'

import { useOptimistic, useTransition, useState } from 'react'
import { toast } from 'sonner'
import { Pencil, X, Check } from 'lucide-react'
import { updateContactLink } from '@/src/actions/contact'
import type { ContactLink } from '@/src/types/contact'

interface ContactInfoProps {
  initialData: ContactLink[]
  isAdmin: boolean
}

type EditDraft = Record<string, { value: string; href: string }>

export function ContactInfo({ initialData, isAdmin }: ContactInfoProps) {
  const [optimisticItems, setOptimisticItems] = useOptimistic(
    initialData,
    (_: ContactLink[], next: ContactLink[]) => next
  )
  const [isEditing, setIsEditing] = useState(false)
  const [editDraft, setEditDraft] = useState<EditDraft>({})
  const [isPending, startTransition] = useTransition()

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('클립보드에 복사되었습니다!')
  }

  const handleEditStart = () => {
    const draft: EditDraft = {}
    initialData.forEach((item) => {
      draft[item.id] = { value: item.value, href: item.href ?? '' }
    })
    setEditDraft(draft)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditDraft({})
  }

  const handleDraftChange = (id: string, field: 'value' | 'href', val: string) => {
    setEditDraft((prev) => ({ ...prev, [id]: { ...prev[id], [field]: val } }))
  }

  const handleSave = () => {
    const updatedItems: ContactLink[] = initialData.map((item) => ({
      ...item,
      value: editDraft[item.id]?.value ?? item.value,
      href: editDraft[item.id]?.href?.trim() || null,
    }))
    startTransition(async () => {
      setOptimisticItems(updatedItems)
      try {
        const changed = initialData.filter((item) => {
          const d = editDraft[item.id]
          if (!d) return false
          return d.value !== item.value || (d.href.trim() || null) !== item.href
        })
        if (changed.length > 0) {
          const results = await Promise.all(
            changed.map((item) => updateContactLink(item.id, {
              value: editDraft[item.id].value,
              href: editDraft[item.id].href || null,
            }))
          )
          const failed = results.find((r) => !r.success)
          if (failed && !failed.success) throw new Error(failed.error)
        }
        setIsEditing(false)
        setEditDraft({})
        toast.success('연락처 정보가 저장되었습니다.')
      } catch (error) {
        toast.error(error instanceof Error ? error.message : '저장에 실패했습니다.')
      }
    })
  }

  return (
    <div>
      {/* 관리자 편집 컨트롤 */}
      {isAdmin && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          {isEditing ? (
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                onClick={handleCancel}
                disabled={isPending}
                title="취소"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', color: 'var(--fg-subtle)' }}
              >
                <X style={{ width: 14, height: 14 }} />
              </button>
              <button
                onClick={handleSave}
                disabled={isPending}
                title="저장"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', color: 'var(--accent)' }}
              >
                <Check style={{ width: 14, height: 14 }} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleEditStart}
              title="연락처 수정"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', color: 'var(--fg-subtle)', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <Pencil style={{ width: 13, height: 13 }} />
            </button>
          )}
        </div>
      )}

      {/* 연락처 행 목록 */}
      {optimisticItems.length === 0 ? (
        <p className="sv-mono text-subtle" style={{ fontSize: 12 }}>연락처 정보가 없습니다.</p>
      ) : (
        <div>
          {optimisticItems.map((item) => {
            const needsHrefInput = isEditing && (item.href !== null || item.icon_key === 'github')

            const valueContent = isEditing ? (
              <div>
                <input
                  type="text"
                  value={editDraft[item.id]?.value ?? item.value}
                  onChange={(e) => handleDraftChange(item.id, 'value', e.target.value)}
                  style={{
                    width: '100%', background: 'transparent', border: 'none',
                    borderBottom: '1px solid var(--border-strong)',
                    outline: 'none', padding: '0 0 2px',
                    fontSize: 15, color: 'var(--fg)', fontFamily: 'inherit',
                  }}
                  autoComplete="off"
                />
                {needsHrefInput && (
                  <input
                    type="url"
                    value={editDraft[item.id]?.href ?? item.href ?? ''}
                    onChange={(e) => handleDraftChange(item.id, 'href', e.target.value)}
                    placeholder="https://"
                    style={{
                      width: '100%', background: 'transparent', border: 'none',
                      borderBottom: '1px solid var(--border)',
                      outline: 'none', padding: '2px 0',
                      fontSize: 12, color: 'var(--fg-subtle)', fontFamily: 'inherit', marginTop: 4,
                    }}
                    autoComplete="off"
                  />
                )}
              </div>
            ) : (
              <span style={{ fontSize: 15, color: 'var(--fg)' }}>{item.value}</span>
            )

            const actionContent = !isEditing && (
              item.is_copyable ? (
                <button
                  onClick={() => handleCopy(item.value)}
                  className="sv-mono"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.08em', padding: 0, whiteSpace: 'nowrap' }}
                >
                  Copy →
                </button>
              ) : item.href ? (
                <span className="sv-mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.08em' }}>Visit ↗</span>
              ) : null
            )

            const rowContent = (
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 20, padding: '22px 0', borderTop: '1px solid var(--border)', alignItems: 'center' }}>
                <div className="sv-mono text-subtle" style={{ fontSize: 11, letterSpacing: '0.12em' }}>
                  {item.label.toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>{valueContent}</div>
                <div>{actionContent}</div>
              </div>
            )

            return item.href && !isEditing ? (
              <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none' }}>
                {rowContent}
              </a>
            ) : (
              <div key={item.id}>{rowContent}</div>
            )
          })}
          <div style={{ borderTop: '1px solid var(--border)' }} />
        </div>
      )}
    </div>
  )
}
