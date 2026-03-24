'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { BlogPost } from '@/src/types/blog'
import Link from 'next/link'
import { Calendar, Clock, Tag, Search, X, ChevronDown } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

const POSTS_PER_PAGE = 6

interface BlogListProps {
  posts: BlogPost[]
}

export const BlogList = ({ posts }: BlogListProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [displayCount, setDisplayCount] = useState(POSTS_PER_PAGE)

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [posts])

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesTag = !selectedTag || post.tags.includes(selectedTag)
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        (post.description?.toLowerCase().includes(q) ?? false) ||
        post.tags.some((t) => t.toLowerCase().includes(q))
      return matchesTag && matchesSearch
    })
  }, [posts, selectedTag, searchQuery])

  // 검색/태그 변경 시 displayCount 리셋
  const prevFilterKey = useRef(`${searchQuery}|${selectedTag}`)
  const currentFilterKey = `${searchQuery}|${selectedTag}`
  if (prevFilterKey.current !== currentFilterKey) {
    prevFilterKey.current = currentFilterKey
    if (displayCount !== POSTS_PER_PAGE) setDisplayCount(POSTS_PER_PAGE)
  }

  const visiblePosts = filteredPosts.slice(0, displayCount)
  const hasMore = displayCount < filteredPosts.length

  const handleLoadMore = useCallback(() => {
    setDisplayCount((prev) => prev + POSTS_PER_PAGE)
  }, [])

  return (
    <>
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">블로그</h1>
        <p className="text-foreground/60 text-sm">개발 경험과 기술적 인사이트를 공유합니다.</p>
      </div>

      {/* 검색바 */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="mb-4"
      >
        <BlogSearchBar query={searchQuery} onQueryChange={setSearchQuery} />
      </motion.div>

      {/* 태그 필터 */}
      {allTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.28 }}
          className="flex items-center gap-2 flex-wrap mb-8"
        >
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer ${
              selectedTag === null
                ? 'bg-foreground text-background'
                : 'bg-background text-foreground/60 border border-foreground/20 hover:border-foreground/40 hover:text-foreground'
            }`}
          >
            <Tag className="w-3 h-3" />
            전체
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                selectedTag === tag
                  ? 'bg-foreground text-background'
                  : 'bg-background text-foreground/60 border border-foreground/20 hover:border-foreground/40 hover:text-foreground'
              }`}
            >
              {tag}
            </button>
          ))}
        </motion.div>
      )}

      {/* 포스트 목록 */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.38 }}
        className="flex flex-col gap-4"
      >
        <AnimatePresence mode="popLayout">
          {visiblePosts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16 flex flex-col items-center gap-3"
            >
              <Search className="w-8 h-8 text-foreground/20" />
              <p className="text-foreground/40 text-base">
                {searchQuery.trim()
                  ? `'${searchQuery}'에 해당하는 글이 없습니다.`
                  : `'${selectedTag}' 태그에 해당하는 글이 없습니다.`}
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedTag(null) }}
                className="text-xs text-foreground/50 hover:text-foreground underline underline-offset-2 transition-colors"
              >
                필터 초기화
              </button>
            </motion.div>
          ) : (
            visiblePosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* 더 보기 버튼 */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mt-8"
        >
          <button
            type="button"
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-foreground/70 bg-background border border-foreground/15 rounded-xl hover:border-foreground/30 hover:text-foreground transition-all duration-200 cursor-pointer"
          >
            더 보기
            <ChevronDown className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* 전체 카운트 */}
      {filteredPosts.length > 0 && (
        <p className="text-center text-xs text-foreground/30 mt-4">
          {filteredPosts.length}개 중 {Math.min(displayCount, filteredPosts.length)}개 표시
        </p>
      )}
    </>
  )
}

const BlogCard = ({ post, index }: { post: BlogPost; index: number }) => {
  const publishedDate = post.published_at
    ? format(new Date(post.published_at), 'yyyy년 MM월 dd일', { locale: ko })
    : null
  const readingTime = Math.max(1, Math.ceil(post.content.length / 500))

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
    >
      <Link href={`/blog/${post.slug}`} className="group block">
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="p-5 bg-background border border-foreground/10 rounded-xl hover:border-foreground/25 hover:shadow-md transition-all duration-200"
        >
          <h2 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-foreground/80 transition-colors mb-1.5 line-clamp-2">
            {post.title}
          </h2>
          {post.description && (
            <p className="text-foreground/55 text-sm line-clamp-2 mb-3">
              {post.description}
            </p>
          )}
          <div className="flex items-center justify-between flex-wrap gap-2">
            {post.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {post.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-foreground/5 border border-foreground/10 text-foreground/60 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {post.tags.length > 4 && (
                  <span className="text-foreground/40 text-xs">+{post.tags.length - 4}</span>
                )}
              </div>
            )}
            <div className="flex items-center gap-3 text-foreground/40 text-xs ml-auto">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {readingTime}분
              </span>
              {publishedDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {publishedDate}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

const BlogSearchBar = ({
  query,
  onQueryChange,
}: {
  query: string
  onQueryChange: (q: string) => void
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative flex items-center">
      <Search className="absolute left-3.5 w-4 h-4 text-foreground/40 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="제목, 설명, 태그 검색..."
        className="w-full pl-10 pr-10 py-2.5 bg-background border border-foreground/20 rounded-xl text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:border-foreground/40 focus:ring-1 focus:ring-foreground/10 transition-colors duration-200"
      />
      <AnimatePresence>
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            type="button"
            onClick={() => { onQueryChange(''); inputRef.current?.focus() }}
            className="absolute right-3 p-0.5 text-foreground/40 hover:text-foreground transition-colors"
            aria-label="검색어 초기화"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
