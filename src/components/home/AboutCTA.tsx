'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { User, Sparkles } from 'lucide-react'

/**
 * About 페이지로 이동하는 CTA 버튼
 *
 * 스틸 메탈 감성의 테두리 글로우 + 반짝이는 인터랙션.
 * bg-white → bg-background 로 다크모드 대응.
 * 파란색 펄스 제거, brand-primary 기반으로 통일.
 */
export function AboutCTA() {
  return (
    <Link href="/about">
      <motion.div
        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-background rounded-xl overflow-hidden cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {/* 호버 시 은은한 메탈 글로우 배경 */}
          <div className="absolute inset-0 bg-foreground/4 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* 메탈 테두리 (단색 → 호버 시 강조) */}
        <div className="absolute inset-0 rounded-xl border border-foreground/15 group-hover:border-foreground/40 transition-colors duration-300" />

        {/* 반짝이는 쉰 효과 */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          initial={{ x: '-100%' }}
          whileHover={{
            x: '100%',
            transition: { duration: 0.6, ease: 'easeInOut' },
          }}
        >
          <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent skew-x-12" />
        </motion.div>

        {/* 콘텐츠 */}
        <div className="relative z-10 flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-5 h-5 text-brand-secondary" />
          </motion.div>

          <span className="text-lg font-bold text-foreground">
            About Me
          </span>

          <User className="w-5 h-5 text-foreground/50 group-hover:text-brand-secondary transition-colors" />
        </div>
      </motion.div>
    </Link>
  )
}
