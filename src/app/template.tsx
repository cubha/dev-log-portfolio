'use client'

import { motion } from 'framer-motion'

/**
 * 글로벌 페이지 트랜지션
 *
 * template.tsx는 Next.js App Router에서 라우트 변경 시 항상 새 인스턴스로 마운트되므로,
 * AnimatePresence + key 없이도 initial → animate가 매 진입마다 실행됩니다.
 *
 * Silver Metal 테마: Quartic Out (초반 빠름 → 끝에서 극도로 부드럽게 멈춤)
 * - y: 15 → 0 : 아래서 살짝 솟아오르는 프리미엄 진입감
 * - duration 0.7s : 여유 있고 묵직한 속도감
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
