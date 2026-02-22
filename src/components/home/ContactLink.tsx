'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'

/**
 * Contact 페이지로 이동하는 링크
 * Footer Link 영역 하단에 배치 — "✉ 문의하기 →"
 */
export function ContactLink() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="text-center"
    >
      <Link
        href="/contact"
        scroll={false}
        className="group inline-flex items-baseline gap-2 text-sm
                   text-foreground/60 hover:text-foreground transition-colors"
      >
        <Mail className="w-3.5 h-3.5 flex-shrink-0" />
        <span>문의하기</span>
        <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
      </Link>
    </motion.div>
  )
}
