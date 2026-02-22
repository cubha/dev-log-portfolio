'use client'

import { motion } from 'framer-motion'

/**
 * 페이지 전환 애니메이션 (Blur + Opacity)
 * 덜컥거림 방지를 위해 짧은 duration, will-change 적용
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(4px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      }}
      style={{ willChange: 'opacity, filter' } as React.CSSProperties}
    >
      {children}
    </motion.div>
  )
}
