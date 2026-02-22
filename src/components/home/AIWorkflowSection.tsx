'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Hammer, Microscope, Zap, Code2, Database, Palette, Sparkles } from 'lucide-react'
import { THEME_CARD_CLASS } from '@/src/components/common/ThemeCard'

// ─── 3단계 정밀 공정 ─────────────────────────────────────────────────────────
const STEPS = [
  {
    step: '01',
    code: 'CTX_INIT',
    title: 'Context Injection & Constraints',
    role: '맥락 주입 & 제약조건 설정',
    description:
      '프로젝트의 아키텍처, 비즈니스 로직, 코드 컨벤션을 AI에게 사전 학습시켜 개발의 방향성을 완벽히 동기화합니다.',
    tags: ['Architecture Sync', 'Constraint Injection', 'Convention Alignment'],
    Icon: Cpu,
  },
  {
    step: '02',
    code: 'MOD_FORGE',
    title: 'Phased Design & Development',
    role: '단계별 설계 및 개발',
    description:
      '전체 기능을 독립된 모듈 단위로 분해하여 AI와 고속 협업합니다. 신속한 단조(Forging)를 통해 개발 속도를 극대화합니다.',
    tags: ['Module Decomposition', 'High-Speed Forging', 'Iterative Verification'],
    Icon: Hammer,
  },
  {
    step: '03',
    code: 'HF_AUDIT',
    title: 'Spec-driven Verification',
    role: '설계 기반 검증',
    description:
      '작성된 코드를 기술 명세서와 대조하여 1:1 정밀 검수를 수행합니다. AI의 속도에 인간의 정교함을 더해 무결점의 결과물을 만듭니다.',
    tags: ['Spec Matching', 'Precision Review', 'Zero-defect Deploy'],
    Icon: Microscope,
  },
]

// ─── Buffer Analysis 데이터 ──────────────────────────────────────────────────
const BUFFER_BREAKDOWN = [
  { label: 'Testing & QA',      pct: 35, barClass: 'bg-brand-secondary/80' },
  { label: 'Refactoring',       pct: 28, barClass: 'bg-brand-primary/70'   },
  { label: 'Performance Opt.', pct: 22, barClass: 'bg-foreground/45'      },
  { label: 'Docs & UX Polish',  pct: 15, barClass: 'bg-foreground/28'      },
]

// ─── Precision Tools 데이터 ──────────────────────────────────────────────────
const AI_TOOLKIT = [
  { name: 'Cursor',   role: 'IDE Control'     },
  { name: 'Claude',   role: 'Logic Architect' },
  { name: 'Gemini',   role: 'Signal Scanner'  },
]

const TECH_STACK = [
  { name: 'Next.js 15',    Icon: Zap      },
  { name: 'TypeScript',    Icon: Code2    },
  { name: 'Supabase',      Icon: Database },
  { name: 'Tailwind CSS',  Icon: Palette  },
  { name: 'Framer Motion', Icon: Sparkles },
]

// ─── 레이아웃 상수 ───────────────────────────────────────────────────────────
const TL_X_REM    = 3.5
const NUM_W_REM   = 3.0
const CARD_ML_REM = 6.0

export function AIWorkflowSection() {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  const handleEnter = useCallback((i: number) => () => setActiveStep(i), [])
  const handleLeave = useCallback(() => setActiveStep(null), [])

  return (
    <section className="w-full pt-12 pb-4">
      <div className="mb-16 mt-12 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

      {/* ── 섹션 헤더 ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-14 text-center"
      >
        <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-foreground/28 mb-3">
          AI Collaboration Protocol
        </p>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
          The Assembly Line
        </h2>
        <p className="mt-3 text-sm text-foreground/40 max-w-xs mx-auto">
          AI와 함께하는 3단계 정밀 공정
        </p>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════
          Circuit Layout — Hover 기반 활성화
      ══════════════════════════════════════════════════════════════════ */}
      <div
        className="relative"
        onMouseLeave={handleLeave}
      >

        {/* ── 스텝 목록 + 연결 영역 (라인: 1번 도트 → 공정 결과 카드 상단) ─ */}
        <div className="relative">
          <div className="space-y-14">
          {STEPS.map((step, i) => {
            const Icon = step.Icon
            const isActive = activeStep === i

            return (
              <div
                key={step.step}
                className="relative flex items-center min-h-[4rem]"
                onMouseEnter={handleEnter(i)}
              >
                {/* 숫자·도트 — flex items-center로 수직 중심축 완벽 일치 */}
                <div
                  className="flex items-center flex-shrink-0"
                  style={{ width: `${CARD_ML_REM}rem` }}
                >
                  <span
                    className={`font-black tabular-nums select-none text-right flex-shrink-0
                               leading-[1] text-3xl md:text-4xl
                               transition-all duration-300
                               ${isActive ? 'text-silver-metal opacity-100 scale-110' : 'text-foreground/40 opacity-30'}`}
                    style={{
                      width: `${NUM_W_REM}rem`,
                      transformOrigin: 'right center',
                    }}
                  >
                    {step.step}
                  </span>
                  <div
                    className="relative flex-shrink-0 flex items-center justify-end"
                    style={{ width: `${TL_X_REM - NUM_W_REM + 0.3125}rem` }}
                  >
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className={`relative z-10 w-2.5 h-2.5 rounded-full flex-shrink-0
                                 transition-all duration-300
                                 ${isActive
                                   ? 'bg-silver-metal shadow-[0_0_10px_3px_hsl(var(--metal-mid)/0.7)]'
                                   : 'bg-background border-2 border-foreground/25 opacity-40'}`}
                    />
                  </div>
                </div>

                {/* 수평 연결 트레이스 */}
                <div
                  className="absolute h-px bg-foreground/10"
                  style={{
                    left: `calc(${TL_X_REM}rem + 7px)`,
                    right: `calc(100% - ${CARD_ML_REM}rem)`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />

                {/* ── 카드 — hover 시 돌출 효과 ─────────────────────────── */}
                <div className="flex-1 relative min-w-0">
                  <motion.div
                    initial={{ opacity: 0, x: 14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{
                      duration: 0.55,
                      ease: [0.22, 1, 0.36, 1],
                      delay: i * 0.1,
                    }}
                    whileHover={{
                      scale: 1.05,
                      y: -8,
                      transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
                    }}
                    className={`${THEME_CARD_CLASS} p-5 text-left cursor-default
                                hover:shadow-lg dark:hover:shadow-xl
                                transition-shadow duration-300`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base md:text-lg font-bold text-foreground">
                        {step.title}
                      </h3>
                      <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-foreground/38" />
                      </div>
                    </div>

                    <p className="text-[11px] font-semibold text-silver-metal mb-3">
                      {step.role}
                    </p>
                    <p className="text-sm text-foreground/50 leading-relaxed mb-4">
                      {step.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[9px] font-medium px-2 py-0.5
                                     rounded border border-foreground/10
                                     text-foreground/32 bg-foreground/2 tracking-wide"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>

              </div>
            )
          })}
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════════
          공정 결과 — Summary Card
      ══════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`${THEME_CARD_CLASS} p-5 mt-14`}
      >
        <div className="flex items-start justify-between mb-4 gap-4">
          <div>
            <p className="font-mono text-[9px] font-bold tracking-[0.2em]
                          text-foreground/25 uppercase mb-1">
              Process Result
            </p>
            <h3 className="text-sm font-bold text-foreground leading-snug">
              공정 결과: 가속으로 확보한 품질 버퍼
            </h3>
            <p className="text-[11px] text-foreground/38 mt-0.5">
              절약된 60% 공정을 완성도에 재투자
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5
                          rounded-full border border-emerald-500/20 bg-emerald-500/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400
                             shadow-[0_0_4px_rgba(52,211,153,0.8)]" />
            <span className="font-mono text-[9px] font-bold text-emerald-400/80
                             tracking-[0.15em]">
              VERIFIED
            </span>
          </div>
        </div>

        <div className="mb-4">
          <div className="relative h-6 bg-foreground/6 rounded-full overflow-hidden flex">
            <motion.div
              className="h-full bg-silver-metal flex items-center justify-center flex-shrink-0"
              initial={{ width: '0%' }}
              whileInView={{ width: '60%' }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
            >
              <span className="font-mono text-[9px] font-bold text-white/70 whitespace-nowrap px-2">
                AI · 60%
              </span>
            </motion.div>
            <motion.div
              className="h-full flex items-center justify-center flex-shrink-0"
              style={{
                background:
                  'linear-gradient(90deg, hsl(var(--metal-mid)/0.25), hsl(var(--metal-mid)/0.5))',
              }}
              initial={{ width: '0%' }}
              whileInView={{ width: '40%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <span className="font-mono text-[9px] font-bold text-foreground/42
                               whitespace-nowrap px-2">
                QUALITY · 40%
              </span>
            </motion.div>
          </div>
          <div className="flex justify-between mt-2 text-[9px] text-foreground/26">
            <span>AI가 처리한 기능 구현</span>
            <span className="text-silver-metal font-semibold">←품질 버퍼 재투자→</span>
          </div>
        </div>

        <div className="border-t border-foreground/6 pt-4 space-y-3">
          {BUFFER_BREAKDOWN.map((item, i) => (
            <div key={item.label} className="flex items-center gap-4">
              <span className="text-[11px] text-foreground/48 w-32 flex-shrink-0">
                {item.label}
              </span>
              <div className="flex-1 h-1 bg-foreground/6 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${item.barClass}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.08 * i, ease: 'easeOut' }}
                />
              </div>
              <span className="font-mono text-[10px] text-foreground/28 tabular-nums w-8 text-right flex-shrink-0">
                {item.pct}%
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════
          AI & Tech Skills — Ultra-Minimal 태그 형태
      ══════════════════════════════════════════════════════════════════ */}

      <div className="mb-16 mt-20 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-14"
      >
        {/* AI TOOLKIT */}
        <div className="mb-4">
          <p className="text-xs font-bold tracking-widest text-foreground/40 uppercase mb-2">
            AI TOOLKIT
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {AI_TOOLKIT.map((t, i) => (
              <motion.div
                key={`ai-${t.name}`}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="relative rounded-lg border border-foreground/5 border-rim-light
                           bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5
                           bg-card-surface shadow-sharp p-2 flex items-center gap-2 min-w-0
                           transition-all duration-300 hover:border-rim-intense"
              >
                <span className="text-lg font-black text-silver-metal flex-shrink-0 leading-none">
                  {t.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{t.name}</p>
                  <p className="font-mono text-[10px] text-foreground/35 truncate">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* TECH STACK */}
        <div>
          <p className="text-xs font-bold tracking-widest text-foreground/40 uppercase mb-2">
            TECH STACK
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {TECH_STACK.map((t, i) => {
              const Icon = t.Icon
              return (
                <motion.div
                  key={`tech-${t.name}`}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: (AI_TOOLKIT.length + i) * 0.03 }}
                  className="relative rounded-lg border border-foreground/5 border-rim-light
                             bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5
                             bg-card-surface shadow-sharp p-2 flex items-center gap-2 min-w-0
                             transition-all duration-300 hover:border-rim-intense"
                >
                  <Icon className="w-5 h-5 text-foreground/40 flex-shrink-0" />
                  <p className="text-sm font-medium text-foreground truncate flex-1 min-w-0">
                    {t.name}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>

    </section>
  )
}
