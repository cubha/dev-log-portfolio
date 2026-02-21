'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  animate,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'framer-motion'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { FolderKanban, ArrowRight } from 'lucide-react'

/** 스포트라이트 원 크기 (1.5배: 700 → 1050px) */
const SPOTLIGHT_SIZE = 1050

/**
 * HeroSection — "The Buffer Philosophy"
 *
 * 텍스트 위계:
 *  1. 소제목: "속도로 얻은 여유를 완성도에 투자하는 개발자" (small, text-foreground/60)
 *  2. 메인 타이틀: "안승호 입니다." (large, text-silver-metal)
 *
 * Progress Bar (단일 바):
 *  Phase 1 (0.65s): 0→80%  brand-primary/blue  (AI 가속 영역)
 *  Phase 2 (1.6s):  80→100% silver shimmer      (완성도 영역)
 *  80% 도달 후 "PERFECTION" 단어가 blur → 선명하게 나타남
 *
 * Button: hover 시에만 shine 애니메이션 작동 (bg-silver-metal + animate-shine)
 */
export function HeroSection() {
  // ── 마우스 추적 (Spotlight) ────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null)
  const rawX = useMotionValue(0.5)
  const rawY = useMotionValue(0.5)
  const springX = useSpring(rawX, { stiffness: 50, damping: 25 })
  const springY = useSpring(rawY, { stiffness: 50, damping: 25 })
  const glowLeft = useTransform(springX, [0, 1], ['25%', '75%'])
  const glowTop  = useTransform(springY, [0, 1], ['20%', '80%'])

  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  // SSR/클라이언트 초기 렌더 시 동일 출력 유지 (resolvedTheme은 SSR에서 undefined)
  const isDark = mounted ? resolvedTheme === 'dark' : false

  // Dark: screen blend, Light: soft-light (Silver Polish)
  const ambientBgDark = useMotionTemplate`radial-gradient(
    ${SPOTLIGHT_SIZE}px circle at ${glowLeft} ${glowTop},
    rgba(255,255,255,0.08) 0%,
    rgba(255,255,255,0) 60%
  )`
  const ambientBgLight = useMotionTemplate`radial-gradient(
    ${SPOTLIGHT_SIZE}px circle at ${glowLeft} ${glowTop},
    rgba(200,210,230,0.4) 0%,
    rgba(200,210,230,0) 70%
  )`
  const edgeMask = useMotionTemplate`radial-gradient(
    circle at 50% 50%,
    black 40%,
    transparent 100%
  )`
  const gridMask = useMotionTemplate`radial-gradient(
    circle at ${glowLeft} ${glowTop},
    black 35%,
    transparent 70%
  )`

  // ── Buffer Progress ─────────────────────────────────────────────────────
  const progress = useMotionValue(0)

  // 파란 영역 너비: 0→60% (빠르게)
  const blueBarWidth   = useTransform(progress, [0, 60, 100], ['0%', '60%', '60%'])
  // 실버 영역 너비: 60% 도달 후 0→40% (천천히)
  const silverBarWidth = useTransform(progress, [60, 100], ['0%', '40%'])

  // "PERFECTION" 단어: 60% 이후 blur 해제
  const perfBlur    = useTransform(progress, [60, 100], [8, 0])
  const perfOpacity = useTransform(progress, [60, 100], [0, 1])
  const perfFilter  = useMotionTemplate`blur(${perfBlur}px)`

  // 퍼센트 카운터 (표시용 상태)
  const [displayPct, setDisplayPct] = useState(0)

  useEffect(() => {
    const unsub = progress.on('change', (v) => setDisplayPct(Math.round(v)))
    return unsub
  }, [progress])

  useEffect(() => {
    // template.tsx 페이지 진입(0.7s) 완료 후 실행
    const t = setTimeout(async () => {
      // Phase 1: AI 가속 — 0→60% 빠르게
      await animate(progress, 60, {
        duration: 0.65,
        ease: [0.4, 0, 0.6, 1],
      })
      // Phase 2: 완성도 투자 — 60→100% 천천히
      await animate(progress, 100, {
        duration: 1.6,
        ease: 'linear',
      })
    }, 900)
    return () => clearTimeout(t)
  }, [progress])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set((e.clientX - rect.left) / rect.width)
    rawY.set((e.clientY - rect.top)  / rect.height)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex flex-col justify-start w-full min-h-[65vh] pt-6 md:pt-10 pb-6 md:pb-8"
    >
      {/* ── 그리드 패턴 (빛 받을 때만 선명) ───────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] dark:opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--foreground) / 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground) / 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 80%)',
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.15] dark:opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--foreground) / 0.25) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground) / 0.25) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
          maskImage: gridMask,
          WebkitMaskImage: gridMask,
        }}
      />

      {/* ── Spotlight (테마별 색상·블렌딩) ────────────────────────────── */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-0 blur-3xl"
        style={{
          background: isDark ? ambientBgDark : ambientBgLight,
          mixBlendMode: isDark ? 'screen' : 'soft-light',
          maskImage: edgeMask,
          WebkitMaskImage: edgeMask,
        }}
      />

      <div className="relative z-10 text-center px-4 md:px-6">

        {/* ① 소제목 (상단, small) */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-lg md:text-xl text-foreground/58 font-medium max-w-md mx-auto mb-10"
        >
          속도로 얻은 여유를,{' '}
          <br className="hidden sm:block" />
          완성도에 투자하는 개발자
        </motion.p>

        {/* ② 메인 타이틀 (하단, large, silver-metal) */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.28 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold
                     tracking-tight leading-tight mb-5"
        >
          은승호 입니다.<br/>
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.28 }}
          className="text-sm font-bold tracking-[0.28em] uppercase text-foreground/35 mb-14"
        >
          AI-Enhanced · Full-Stack Developer
        </motion.p>

        {/* ── "Efficiency to Quality" 단일 Progress Bar ─────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="max-w-lg mx-auto mb-12"
        >
          {/* 바 상단 레이블 */}
          <div className="flex items-center justify-between mb-3">
            {/* 왼쪽: AI 영역 (60%) */}
            <span className="text-sm font-semibold text-foreground/40 leading-tight text-left">
              AI로 단축된 공정{' '}
              <span className="text-brand-primary font-bold">60%</span>
            </span>
            {/* 오른쪽: 완성도 영역 (40%) */}
            <span className="text-sm font-semibold text-foreground/40 leading-tight text-right">
              완성도에 재투자한 시간{' '}
              <span className="text-silver-metal font-bold">40%</span>
            </span>
          </div>

          {/* 트랙 */}
          <div className="relative h-5 bg-foreground/8 rounded-full overflow-hidden flex">
            {/* 파란 영역 — AI 가속 (0→80%) */}
            <motion.div
              className="h-full rounded-l-full bg-brand-primary/70 flex-shrink-0"
              style={{ width: blueBarWidth }}
            />
            {/* 실버 영역 — 완성도 (80→100%) */}
            <motion.div
              className="h-full rounded-r-full flex-shrink-0"
              style={{
                width: silverBarWidth,
                background:
                  'linear-gradient(90deg, hsl(var(--metal-start)/0.7), hsl(var(--metal-mid)), white)',
              }}
            />
          </div>

          {/* 60% 구분 마커 (트랙 위에 오버레이) */}
          <div className="relative h-0">
            <div
              className="absolute -top-3 bottom-0 w-px bg-background/50"
              style={{ left: '60%' }}
            />
          </div>

          {/* 퍼센트 카운터 + PERFECTION 단어 */}
          <div className="flex items-center justify-between mt-4">
            <span className="font-mono text-sm text-foreground/30 tabular-nums">
              {displayPct}%
            </span>
            <motion.span
              className="text-silver-metal text-sm font-black tracking-[0.3em] uppercase"
              style={{ opacity: perfOpacity, filter: perfFilter }}
            >
              Perfection
            </motion.span>
          </div>
        </motion.div>

        {/* ── CTA 버튼 — bg-silver-metal(기본), hover 시만 shine ───────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.62 }}
          className="flex justify-center mt-12"
        >
          <Link
            href="/projects"
            className="group inline-flex items-center gap-5 px-12 py-5
                       bg-silver-metal animate-shine
                       text-white dark:text-slate-100
                       text-xl font-semibold rounded-xl
                       shadow-md hover:shadow-xl hover:-translate-y-0.5
                       transition-[transform,box-shadow] duration-300
                       focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:ring-offset-2"
          >
            <FolderKanban className="w-5 h-5" />
            <span>프로젝트 보기</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
          </Link>
        </motion.div>

      </div>
    </div>
  )
}
