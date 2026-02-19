'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

/**
 * About 페이지로 이동하는 서브틀 링크
 * 
 * 프로젝트 슬라이더 근처에 배치되는 텍스트 링크입니다.
 */
export function AboutLink() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="text-center pt-8"
    >
      <Link href="/about" className="group inline-flex items-center gap-2">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Sparkles className="w-4 h-4 text-brand-secondary" />
        </motion.div>
        
        <span className="text-foreground/60 group-hover:text-brand-secondary transition-colors">
          더 자세한 역량이 궁금하신가요?
        </span>
        
        <motion.div
          className="flex items-center gap-1 text-brand-secondary font-semibold"
          whileHover={{ x: 5 }}
          transition={{ type: 'spring', stiffness: 400 }}
          >
            <span>About Me</span>
          <ArrowRight className="w-4 h-4" />
        </motion.div>
      </Link>
    </motion.div>
  )
}
