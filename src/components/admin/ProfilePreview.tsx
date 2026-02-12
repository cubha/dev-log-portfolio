'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { StorySection } from '@/src/types/profile'
import { User } from 'lucide-react'

interface ProfilePreviewProps {
  mainCopy: string
  introText: string
  profileImageUrl: string | null
  storySections: StorySection[]
}

/**
 * 프로필 실시간 미리보기 컴포넌트
 * 
 * 관리자가 입력한 내용이 실제 About 페이지에서 어떻게 보일지 미리 보여줍니다.
 */
export function ProfilePreview({
  mainCopy,
  introText,
  profileImageUrl,
  storySections,
}: ProfilePreviewProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-auto max-h-[calc(100vh-120px)]">
      <div className="mb-4 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-blue-600">👀</span>
          미리보기
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          About 페이지에서 이렇게 표시됩니다
        </p>
      </div>

      <div className="space-y-8">
        {/* 헤더 섹션 */}
        <section className="text-center">
          {/* 프로필 이미지 */}
          <div className="mb-6 flex justify-center">
            {profileImageUrl ? (
              <div className="relative w-32 h-32">
                <Image
                  src={profileImageUrl}
                  alt="프로필"
                  fill
                  className="object-cover rounded-full border-4 border-blue-500 shadow-lg"
                />
              </div>
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full border-4 border-blue-500 shadow-lg flex items-center justify-center">
                <User className="w-16 h-16 text-white opacity-50" />
              </div>
            )}
          </div>

          {/* 메인 카피 */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {mainCopy || '메인 카피를 입력하세요'}
          </h1>

          {/* 서두 소개글 */}
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line max-w-xl mx-auto">
            {introText || '서두 소개글을 입력하세요'}
          </p>
        </section>

        {/* 스토리 섹션들 */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
            About Me
          </h2>

          {storySections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-xl border border-blue-100"
            >
              <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">{section.icon}</span>
                {section.title}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {section.content || `${section.title} 내용이 여기에 표시됩니다...`}
              </p>
            </motion.div>
          ))}
        </section>

        {/* 비어있을 때 안내 */}
        {!mainCopy && !introText && storySections.every(s => !s.content) && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">왼쪽 폼에서 내용을 입력하면</p>
            <p className="text-sm">여기에 실시간으로 표시됩니다</p>
          </div>
        )}
      </div>
    </div>
  )
}
