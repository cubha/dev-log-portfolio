'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { BlogPost } from '@/src/types/blog'
import { STATUS_LABEL } from '@/src/types/blog'
import Link from 'next/link'
import { Search, X, Pencil, Trash2, Eye, EyeOff, Check, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { deleteBlogPost, togglePublish } from '@/src/actions/blog'
import { toast } from 'sonner'

const POSTS_PER_PAGE = 10

type StatusFilter = 'all' | 'published' | 'draft' | 'archived'

interface BlogListProps {
  posts: BlogPost[]
  isAdmin?: boolean
}

export const BlogList = ({ posts, isAdmin = false }: BlogListProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all')
  const [displayCount, setDisplayCount] = useState(POSTS_PER_PAGE)

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [posts])

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus
      const matchesTag = !selectedTag || post.tags.includes(selectedTag)
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        (post.description?.toLowerCase().includes(q) ?? false) ||
        post.tags.some((t) => t.toLowerCase().includes(q))
      return matchesStatus && matchesTag && matchesSearch
    })
  }, [posts, selectedStatus, selectedTag, searchQuery])

  const prevFilterKey = useRef(`${searchQuery}|${selectedTag}|${selectedStatus}`)
  const currentFilterKey = `${searchQuery}|${selectedTag}|${selectedStatus}`
  if (prevFilterKey.current !== currentFilterKey) {
    prevFilterKey.current = currentFilterKey
    if (displayCount !== POSTS_PER_PAGE) setDisplayCount(POSTS_PER_PAGE)
  }

  const visiblePosts = filteredPosts.slice(0, displayCount)
  const hasMore = displayCount < filteredPosts.length

  const handleLoadMore = useCallback(() => setDisplayCount((p) => p + POSTS_PER_PAGE), [])

  return (
    <>
      {/* Search + tag filters */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '18px 0',
          marginBottom: 40,
          flexWrap: 'wrap',
        }}
      >
        {/* Tag filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={`tag ${selectedTag === null ? 'active' : ''}`}
            style={{ padding: '6px 14px', fontSize: 12, cursor: 'pointer', background: 'transparent' }}
          >
            전체
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`tag ${selectedTag === tag ? 'active' : ''}`}
              style={{ padding: '6px 14px', fontSize: 12, cursor: 'pointer', background: 'transparent' }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fg-muted)' }}>
          <Search className="w-3.5 h-3.5" style={{ flexShrink: 0 }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="제목, 설명, 태그 검색 …"
            className="sv-input"
            style={{ width: 'clamp(160px, 16.7vw, 240px)', padding: '6px 2px', borderBottom: 'none', fontSize: 13 }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{ color: 'var(--fg-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Admin status filter */}
        {isAdmin && (
          <div style={{ display: 'flex', gap: 6 }}>
            {(['all', 'published', 'draft', 'archived'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedStatus(s)}
                className={`tag ${selectedStatus === s ? 'active' : ''}`}
                style={{ padding: '4px 10px', fontSize: 11, cursor: 'pointer', background: 'transparent' }}
              >
                {s === 'all' ? '전체' : STATUS_LABEL[s] ?? s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Post list */}
      {visiblePosts.length === 0 ? (
        <div className="sv-mono text-subtle" style={{ fontSize: 12, letterSpacing: '0.08em', padding: '40px 0' }}>
          {searchQuery.trim()
            ? `'${searchQuery}'에 해당하는 글이 없습니다.`
            : selectedTag
            ? `'${selectedTag}' 태그에 해당하는 글이 없습니다.`
            : '글이 없습니다.'}
        </div>
      ) : (
        <div>
          {visiblePosts.map((post, index) => (
            <BlogRow key={post.id} post={post} index={index} isAdmin={isAdmin} />
          ))}
          <div style={{ borderTop: '1px solid var(--border)' }} />
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <button
            type="button"
            onClick={handleLoadMore}
            className="btn"
            style={{ padding: '10px 24px', fontSize: 13 }}
          >
            더 보기 <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {filteredPosts.length > 0 && (
        <div className="sv-mono text-subtle" style={{ fontSize: 11, letterSpacing: '0.1em', textAlign: 'center', marginTop: 24 }}>
          {filteredPosts.length} OF {posts.length} POSTS
        </div>
      )}
    </>
  )
}

function BlogRow({ post, index, isAdmin = false }: { post: BlogPost; index: number; isAdmin?: boolean }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
        .replace(/\. /g, '.').replace(/\.$/, '')
    : post.updated_at
    ? new Date(post.updated_at).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
        .replace(/\. /g, '.').replace(/\.$/, '')
    : ''

  const readingTime = Math.max(1, Math.ceil(post.content.length / 500))

  const handleTogglePublish = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    const willPublish = post.status !== 'published'
    const result = await togglePublish(post.id, willPublish)
    if (!result.success) toast.error(result.error)
    else { toast(willPublish ? '발행되었습니다.' : '임시저장으로 변경되었습니다.'); router.refresh() }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (deletingId !== post.id) { setDeletingId(post.id); return }
    setDeletingId(null)
    const result = await deleteBlogPost(post.id)
    if (!result.success) toast.error(result.error)
    else { toast('삭제되었습니다.'); router.refresh() }
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="row-link"
      style={{
        display: 'grid',
        gridTemplateColumns: 'clamp(100px, 9.7vw, 140px) 1fr clamp(80px, 8.3vw, 120px)',
        gap: 'clamp(16px, 2.8vw, 40px)',
        alignItems: 'start',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      {/* Date */}
      <div className="sv-mono text-subtle" style={{ fontSize: 12, letterSpacing: '0.06em', paddingTop: 4 }}>
        {date}
      </div>

      {/* Title + excerpt + tags */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <div className="h-3" style={{ letterSpacing: '-0.02em' }}>{post.title}</div>
          {isAdmin && post.status !== 'published' && (
            <span className="sv-mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.1em' }}>
              [{STATUS_LABEL[post.status] ?? post.status}]
            </span>
          )}
        </div>
        {post.description && (
          <div
            className="text-muted"
            style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 720, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {post.description}
          </div>
        )}
        {post.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {post.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}

        {/* Admin actions */}
        {isAdmin && (
          <div
            style={{ display: 'flex', gap: 6, marginTop: 12 }}
            onClick={(e) => e.preventDefault()}
          >
            <button
              onClick={handleTogglePublish}
              style={{ padding: '4px 8px', background: 'none', border: '1px solid var(--border)', color: 'var(--fg-muted)', cursor: 'pointer', fontSize: 11 }}
              title={post.status === 'published' ? '발행 취소' : '발행'}
            >
              {post.status === 'published' ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/blog/edit/${post.id}`) }}
              style={{ padding: '4px 8px', background: 'none', border: '1px solid var(--border)', color: 'var(--fg-muted)', cursor: 'pointer' }}
              title="수정"
            >
              <Pencil className="w-3 h-3" />
            </button>
            {deletingId === post.id ? (
              <>
                <button
                  onClick={handleDelete}
                  style={{ padding: '4px 8px', background: 'none', border: '1px solid var(--color-error)', color: 'var(--color-error)', cursor: 'pointer', fontSize: 11 }}
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeletingId(null) }}
                  style={{ padding: '4px 8px', background: 'none', border: '1px solid var(--border)', color: 'var(--fg-muted)', cursor: 'pointer' }}
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : (
              <button
                onClick={handleDelete}
                style={{ padding: '4px 8px', background: 'none', border: '1px solid var(--border)', color: 'var(--fg-muted)', cursor: 'pointer' }}
                title="삭제"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Reading time */}
      <div className="sv-mono text-subtle" style={{ fontSize: 11, letterSpacing: '0.08em', textAlign: 'right', paddingTop: 4 }}>
        {readingTime} MIN READ
      </div>
    </Link>
  )
}
