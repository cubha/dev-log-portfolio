'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { User, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { AboutProfile } from '@/src/types/profile'
import { ThemeCard } from '@/src/components/common/ThemeCard'

interface AboutContentProps {
  profile: AboutProfile | null
}

/**
 * About 페이지 동적 콘텐츠
 *
 * - intro_text를 DB에서 가져와 pre-wrap으로 표시합니다.
 * - story_json 섹션은 isVisible === true인 항목만 렌더링합니다.
 * - 프로필 이미지 클릭 시 확대 모달을 표시합니다.
 */
export function AboutContent({ profile }: AboutContentProps) {
  const [isImageExpanded, setIsImageExpanded] = useState(false)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isImageExpanded) setIsImageExpanded(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isImageExpanded])

  useEffect(() => {
    document.body.style.overflow = isImageExpanded ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isImageExpanded])

  if (!profile) {
    return (
      <div className="bg-background rounded-xl shadow-sm border border-foreground/10 p-8 mb-8">
        <div className="prose prose-lg max-w-none text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">프로필이 없습니다</h2>
          <p className="text-foreground/60">아직 등록된 프로필이 없습니다.</p>
        </div>
      </div>
    )
  }

  // isVisible === true 인 항목만 렌더링 (content 유무와 무관)
  const visibleStorySections = (profile.story_json ?? []).filter(
    (section) => section.isVisible !== false
  )

  return (
    <>
      {/* 히어로 섹션 */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="min-h-[70vh] flex flex-col items-center justify-center text-center px-8 py-16 mb-3"
      >
        {/* 프로필 이미지 */}
        <div className="mb-12 flex justify-center">
          {profile.profile_image_url ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.08 }}
              onClick={() => setIsImageExpanded(true)}
              className="relative w-80 h-80 cursor-pointer rounded-full bg-brand-primary/30 p-[3px]"
            >
              <div className="relative w-full h-full rounded-full overflow-hidden bg-background">
                <Image
                  src={profile.profile_image_url}
                  alt="프로필"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.08 }}
              className="w-80 h-80 rounded-full bg-brand-primary/30 p-[3px]"
            >
              <div className="w-full h-full bg-foreground/10 rounded-full flex items-center justify-center">
                <User className="w-36 h-36 text-foreground/30" />
              </div>
            </motion.div>
          )}
        </div>

        {/* 이미지 확대 모달 */}
        <AnimatePresence>
          {isImageExpanded && profile.profile_image_url && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsImageExpanded(false)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
            >
              <button
                onClick={() => setIsImageExpanded(false)}
                className="absolute top-6 right-6 z-10 p-3 bg-white/10 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/20 transition-colors group"
                aria-label="닫기"
              >
                <X className="w-7 h-7 text-white group-hover:text-gray-100" />
              </button>

              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl aspect-square cursor-default"
              >
                <Image
                  src={profile.profile_image_url}
                  alt="프로필 확대"
                  fill
                  className="object-contain rounded-2xl"
                  priority
                />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-8 text-white/60 text-sm tracking-wide"
              >
                클릭하거나 ESC를 눌러 닫기
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 메인 타이틀 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6"
        >
          <h1
            className="font-bold text-foreground whitespace-nowrap"
            style={{
              fontSize: 'clamp(0.875rem, 2.5vw, 1.5rem)',
              letterSpacing: '-0.02em',
            }}
          >
            {profile.main_copy}
          </h1>
        </motion.div>

        {/* 서두 소개글 - DB intro_text, pre-wrap */}
        {profile.intro_text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-sm text-foreground/60 max-w-xl leading-relaxed"
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {profile.intro_text}
          </motion.p>
        )}
      </motion.section>

      {/* About Me 스토리 섹션 — isVisible === true 항목만 */}
      <AnimatePresence>
        {visibleStorySections.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 mb-8"
          >
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2"
            >
              <span className="w-1 h-6 bg-foreground/30 rounded-full" />
              About Me
            </motion.h2>

            {visibleStorySections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <ThemeCard className="p-5">
                  <h3 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
                    {section.icon && <span className="text-lg">{section.icon}</span>}
                    {section.title}
                  </h3>
                  <p className="text-sm text-foreground/70 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                </ThemeCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
