'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { User, Sparkles } from 'lucide-react'

/**
 * About 페이지로 이동하는 CTA 버튼
 * 
 * 테크니컬한 감성의 글로우 효과와 인터랙티브 애니메이션을 제공합니다.
 */
export function AboutCTA() {
  return (
    <Link href="/about">
      <motion.div
        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white rounded-xl overflow-hidden cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {/* 글로우 배경 */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 via-brand-secondary/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundSize: '200% 200%',
          }}
        />

        {/* 보더 그라데이션 */}
        <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-brand-primary via-brand-secondary to-pink-500 opacity-60 group-hover:opacity-100 transition-opacity">
          <div className="absolute inset-[2px] bg-white rounded-xl" />
        </div>

        {/* 반짝이는 효과 */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          initial={{ x: '-100%' }}
          whileHover={{
            x: '100%',
            transition: {
              duration: 0.6,
              ease: 'easeInOut',
            },
          }}
        >
          <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
        </motion.div>

        {/* 콘텐츠 */}
        <div className="relative z-10 flex items-center gap-3">
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <Sparkles className="w-5 h-5 text-brand-secondary" />
          </motion.div>
          <span className="text-lg font-bold bg-gradient-to-r from-brand-primary via-brand-secondary to-pink-600 bg-clip-text text-transparent">
            About Me
          </span>
          <User className="w-5 h-5 text-brand-primary group-hover:text-brand-secondary transition-colors" />
        </div>

        {/* 펄스 효과 */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-blue-500/50"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </Link>
  )
}
