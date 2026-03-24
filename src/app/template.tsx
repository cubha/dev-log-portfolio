'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

let isFirstRender = true

/**
 * 페이지 전환 애니메이션 (Opacity + Fade-up)
 * 덜컥거림 방지를 위해 짧은 duration, will-change 적용
 */
export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    isFirstRender = false
  }, [])

  return (
    <motion.div
      initial={isFirstRender ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.22,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{ willChange: 'opacity, transform' } as React.CSSProperties}
    >
      {children}
    </motion.div>
  )
}
