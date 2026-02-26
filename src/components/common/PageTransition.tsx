'use client'

import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, type Variants } from 'framer-motion'

const variants: Variants = {
  enter: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.12, ease: 'linear' },
  },
}

/**
 * 글로벌 페이지 트랜지션
 *
 * - mode="wait": exit 완료까지 레이아웃 높이 유지
 * - blur + opacity: Y축/scale 제거로 덜컥거림 방지
 * - min-h-screen + overflow-x-hidden: 푸터 튐·가로 스크롤 방지
 * - onAnimationStart에서 scrollTo: 애니메이션과 동기화
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ willChange: 'opacity' } as React.CSSProperties}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={pathname}
          variants={variants}
          initial="enter"
          animate="visible"
          exit="exit"
          className="overflow-hidden"
          style={{ backfaceVisibility: 'hidden' } as React.CSSProperties}
          onAnimationStart={() => {
            window.scrollTo(0, 0)
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
