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

const SPOTLIGHT_SIZE = 1050
const NAME_WORDS = ['은승호', '입니다.']

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rawX = useMotionValue(0.5)
  const rawY = useMotionValue(0.5)
  const springX = useSpring(rawX, { stiffness: 50, damping: 25 })
  const springY = useSpring(rawY, { stiffness: 50, damping: 25 })
  const glowLeft = useTransform(springX, [0, 1], ['25%', '75%'])
  const glowTop = useTransform(springY, [0, 1], ['20%', '80%'])

  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = mounted ? resolvedTheme === 'dark' : false

  const ambientBgDark = useMotionTemplate`radial-gradient(
    ${SPOTLIGHT_SIZE}px circle at ${glowLeft} ${glowTop},
    rgba(255,255,255,0.07) 0%,
    rgba(255,255,255,0) 60%
  )`
  const ambientBgLight = useMotionTemplate`radial-gradient(
    ${SPOTLIGHT_SIZE}px circle at ${glowLeft} ${glowTop},
    rgba(200,210,230,0.35) 0%,
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

  // Buffer Progress
  const progress = useMotionValue(0)
  const blueBarWidth = useTransform(progress, [0, 60, 100], ['0%', '60%', '60%'])
  const silverBarWidth = useTransform(progress, [60, 100], ['0%', '40%'])
  const perfBlur = useTransform(progress, [60, 100], [8, 0])
  const perfOpacity = useTransform(progress, [60, 100], [0, 1])
  const perfFilter = useMotionTemplate`blur(${perfBlur}px)`
  const [displayPct, setDisplayPct] = useState(0)

  useEffect(() => {
    const unsub = progress.on('change', (v) => setDisplayPct(Math.round(v)))
    return unsub
  }, [progress])

  useEffect(() => {
    const t = setTimeout(async () => {
      await animate(progress, 60, { duration: 0.65, ease: [0.4, 0, 0.6, 1] })
      await animate(progress, 100, { duration: 1.6, ease: 'linear' })
    }, 900)
    return () => clearTimeout(t)
  }, [progress])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set((e.clientX - rect.left) / rect.width)
    rawY.set((e.clientY - rect.top) / rect.height)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[70vh] flex items-center py-16 overflow-hidden"
    >
      {/* Effects layer — edges fade out smoothly */}
      <div className="effects-fade">
        {/* Ambient glow */}
        <div
          className="ambient-glow"
          style={{ width: 800, height: 800, top: '-20%', left: '10%' }}
        />
        <div
          className="ambient-glow"
          style={{ width: 600, height: 600, bottom: '-10%', right: '5%' }}
        />

        {/* Grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] dark:opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--foreground) / 0.12) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--foreground) / 0.12) 1px, transparent 1px)
            `,
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          }}
        />
        <motion.div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] dark:opacity-[0.10]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--foreground) / 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--foreground) / 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '28px 28px',
            maskImage: gridMask,
            WebkitMaskImage: gridMask,
          }}
        />

        {/* Spotlight */}
        <motion.div
          className="pointer-events-none absolute inset-0 -z-0 blur-3xl"
          style={{
            background: isDark ? ambientBgDark : ambientBgLight,
            mixBlendMode: isDark ? 'screen' : 'soft-light',
            maskImage: edgeMask,
            WebkitMaskImage: edgeMask,
          }}
        />
      </div>

      {/* Main content — vertical center */}
      <div className="relative z-10 w-full px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase text-foreground/35">
              Portfolio
            </span>
            <span className="w-8 h-px bg-foreground/20" />
            <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase text-foreground/35">
              2026
            </span>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="text-base md:text-lg text-foreground/50 font-medium mb-6 leading-relaxed"
          >
            속도로 얻은 여유를, 완성도에 투자하는 개발자
          </motion.p>

          {/* Name — word stagger */}
          <div
            className="flex flex-wrap gap-x-4 gap-y-1 mb-10 justify-center"
            aria-label="은승호 입니다."
          >
            {NAME_WORDS.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.28 + i * 0.12,
                }}
                className={`text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight ${
                  i === 0 ? 'text-silver-metal' : 'text-foreground/75'
                }`}
              >
                {word}
              </motion.span>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex justify-center mb-10"
          >
            <Link
              href="/projects"
              scroll={false}
              className="group inline-flex items-center gap-3 px-8 py-4
                         btn-silver-hero
                         text-white dark:text-slate-100
                         text-base font-semibold rounded-xl
                         shadow-md hover:shadow-xl hover:-translate-y-0.5
                         transition-[transform,box-shadow] duration-300
                         focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:ring-offset-2"
            >
              <FolderKanban className="w-4 h-4" />
              <span>프로젝트 보기</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
            </Link>
          </motion.div>

          {/* Buffer Philosophy — inline card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.65 }}
            className="max-w-md mx-auto"
          >
            <div className="glass-card rounded-2xl p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-mono text-[9px] font-bold tracking-[0.22em] uppercase text-foreground/30 mb-1">
                    Buffer Philosophy
                  </p>
                  <h3 className="text-sm font-bold text-foreground">
                    Efficiency → Quality
                  </h3>
                </div>
                <span className="font-mono text-2xl font-black text-silver-metal tabular-nums">
                  {displayPct}
                  <span className="text-sm font-medium text-foreground/30">%</span>
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-[10px] text-foreground/38 mb-2 font-medium">
                  <span>AI 가속 공정</span>
                  <span>완성도 재투자</span>
                </div>

                <div className="relative h-5 bg-foreground/6 rounded-full overflow-hidden flex">
                  <motion.div
                    className="h-full rounded-l-full bg-brand-secondary/60 flex-shrink-0 flex items-center justify-end pr-2"
                    style={{ width: blueBarWidth }}
                  >
                    <span className="font-mono text-[8px] font-bold text-white/60 whitespace-nowrap">60%</span>
                  </motion.div>
                  <motion.div
                    className="h-full rounded-r-full flex-shrink-0"
                    style={{
                      width: silverBarWidth,
                      background:
                        'linear-gradient(90deg, hsl(var(--metal-start)/0.7), hsl(var(--metal-mid)), white)',
                    }}
                  />
                </div>

                <div className="relative h-0">
                  <div
                    className="absolute -top-2.5 bottom-0 w-px bg-background/50"
                    style={{ left: '60%' }}
                  />
                </div>
              </div>

              {/* Perfection label */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-foreground/30 font-medium">속도</span>
                <motion.span
                  className="text-silver-metal text-xs font-black tracking-[0.3em] uppercase"
                  style={{ opacity: perfOpacity, filter: perfFilter }}
                >
                  Perfection
                </motion.span>
                <span className="text-[10px] text-foreground/30 font-medium">완성도</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
