'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { User, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { AboutProfile } from '@/src/types/profile'

interface AboutContentProps {
  profile: AboutProfile | null
}

/**
 * About 페이지 동적 콘텐츠
 * 
 * DB에서 가져온 프로필 데이터를 표시합니다.
 * 빈 섹션은 자동으로 숨겨집니다.
 * 프로필 이미지 클릭 시 확대 모달을 표시합니다.
 */
export function AboutContent({ profile }: AboutContentProps) {
  const [isImageExpanded, setIsImageExpanded] = useState(false)

  // ESC 키로 이미지 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isImageExpanded) {
        setIsImageExpanded(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isImageExpanded])

  // 이미지 확대 모달이 열릴 때 body 스크롤 비활성화
  useEffect(() => {
    if (isImageExpanded) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isImageExpanded])
  if (!profile) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="prose prose-lg max-w-none text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">프로필이 없습니다</h2>
          <p className="text-gray-600">
            아직 등록된 프로필이 없습니다.
          </p>
        </div>
      </div>
    )
  }

  // 스토리 섹션 필터링: 내용이 있는 것만 표시
  const validStorySections = profile.story_json?.filter(
    (section) => section.content && section.content.trim().length > 0
  ) || []

  return (
    <>
      {/* 히어로 섹션 - 극도의 미니멀리즘 */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="min-h-[70vh] flex flex-col items-center justify-center text-center px-8 py-16 mb-3"
      >
        {/* 프로필 이미지 - 인스타 스타일 심플 */}
        <div className="mb-12 flex justify-center">
          {profile.profile_image_url ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.08 }}
              onClick={() => setIsImageExpanded(true)}
              className="relative w-80 h-80 cursor-pointer rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary p-[3px]"
            >
              <div className="relative w-full h-full rounded-full overflow-hidden bg-white">
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
              className="w-80 h-80 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary p-[3px]"
            >
              <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-36 h-36 text-gray-300" />
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
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                }}
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

        {/* 메인 타이틀 - 무조건 한 줄 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-4"
        >
          <h1 
            className="font-bold text-gray-900 whitespace-nowrap"
            style={{
              fontSize: 'clamp(0.875rem, 2.5vw, 1.5rem)',
              letterSpacing: '-0.02em',
            }}
          >
            {profile.main_copy}
          </h1>
        </motion.div>

        {/* 서브 텍스트 - 은은한 스파이시 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-sm text-gray-500"
          style={{
            letterSpacing: '0.15em',
          }}
        >
          긍정적 소통 • 사용자 중심 설계 • 진취적 자기개발
        </motion.p>
      </motion.section>

      {/* 스토리 섹션들 - 내용이 있는 것만 표시 */}
      {validStorySections.length > 0 && (
        <div className="space-y-6 mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"
          >
            <span className="w-1 h-6 bg-gradient-to-b from-brand-primary to-brand-secondary rounded-full"></span>
            About Me
          </motion.h2>

          {validStorySections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                {section.icon && <span className="text-lg">{section.icon}</span>}
                {section.title}
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* 내용이 없을 때 안내 */}
      {validStorySections.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gray-50 rounded-xl p-8 text-center"
        >
          <p className="text-gray-500">
            스토리 섹션이 아직 작성되지 않았습니다.
          </p>
        </motion.div>
      )}
    </>
  )
}
