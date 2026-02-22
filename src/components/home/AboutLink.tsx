'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

/**
 * About 페이지로 이동하는 링크
 * Footer Link 영역 상단에 배치 — "더 자세한 역량이 궁금하신가요? About Me →"
 */
export function AboutLink() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="text-center"
    >
      <div className="mb-16" />
      <Link
        href="/about"
        scroll={false}
        className="group inline-flex items-baseline gap-2 text-sm
                   text-foreground/60 hover:text-foreground transition-colors"
      >
        <Sparkles className="w-3.5 h-3.5 text-brand-secondary/80 flex-shrink-0" />
        <span className="group-hover:text-brand-secondary transition-colors">
          더 자세한 역량이 궁금하신가요?
        </span>
        <span className="font-semibold text-brand-secondary">About Me</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </motion.div>
  )
}
