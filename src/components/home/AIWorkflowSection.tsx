'use client'

import { motion } from 'framer-motion'
import { Cpu, Hammer, Microscope, Zap, Code2, Database, Palette, Sparkles } from 'lucide-react'
import { THEME_CARD_CLASS } from '@/src/components/common/ThemeCard'

const STEPS = [
  {
    step: '01',
    title: 'Context Injection',
    role: '맥락 주입 & 제약조건 설정',
    description:
      '프로젝트의 아키텍처, 비즈니스 로직, 코드 컨벤션을 AI에게 사전 학습시켜 개발의 방향성을 동기화합니다.',
    Icon: Cpu,
  },
  {
    step: '02',
    title: 'Phased Development',
    role: '단계별 설계 및 개발',
    description:
      '전체 기능을 독립된 모듈 단위로 분해하여 AI와 고속 협업합니다. 신속한 단조(Forging)를 통해 개발 속도를 극대화합니다.',
    Icon: Hammer,
  },
  {
    step: '03',
    title: 'Spec-driven Verification',
    role: '설계 기반 검증',
    description:
      '작성된 코드를 기술 명세서와 대조하여 정밀 검수를 수행합니다. AI의 속도에 인간의 정교함을 더해 완성도를 확보합니다.',
    Icon: Microscope,
  },
]

const BUFFER_BREAKDOWN = [
  { label: 'Testing & QA', pct: 35 },
  { label: 'Refactoring', pct: 28 },
  { label: 'Performance Opt.', pct: 22 },
  { label: 'Docs & UX Polish', pct: 15 },
]

const TECH_STACK = [
  { name: 'Next.js 15', Icon: Zap },
  { name: 'TypeScript', Icon: Code2 },
  { name: 'Supabase', Icon: Database },
  { name: 'Tailwind CSS', Icon: Palette },
  { name: 'Framer Motion', Icon: Sparkles },
]

export function AIWorkflowSection() {
  return (
    <section className="w-full py-12">
      {/* Divider */}
      <div className="mb-8 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10 text-center"
      >
        <p className="font-mono text-[10px] font-bold tracking-[0.28em] uppercase text-foreground/28 mb-3">
          AI Collaboration Protocol
        </p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          The Assembly Line
        </h2>
        <p className="mt-3 text-sm text-foreground/40 max-w-xs mx-auto">
          AI와 함께하는 3단계 정밀 공정
        </p>
      </motion.div>

      {/* Timeline — vertical flow */}
      <div className="relative max-w-2xl mx-auto">
        {/* Connecting line */}
        <div
          className="absolute left-5 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-foreground/15 via-foreground/10 to-transparent"
          aria-hidden
        />

        <div className="space-y-6">
          {STEPS.map((step, i) => {
            const Icon = step.Icon
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                className="relative flex gap-4 md:gap-6"
              >
                {/* Step number dot */}
                <div className="relative z-10 flex-shrink-0 w-10 md:w-12 flex flex-col items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-surface border border-foreground/[0.12] flex items-center justify-center shadow-sharp">
                    <span className="font-mono text-sm font-bold text-foreground/50">
                      {step.step}
                    </span>
                  </div>
                </div>

                {/* Card */}
                <div className={`${THEME_CARD_CLASS} flex-1 p-5`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-base font-bold text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-xs text-foreground/40 mt-0.5">
                        {step.role}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-foreground/[0.06] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-foreground/45" />
                    </div>
                  </div>
                  <p className="text-sm text-foreground/50 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Buffer summary — end of flow */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="max-w-2xl mx-auto mt-12"
      >
        <div className={`${THEME_CARD_CLASS} p-6`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-mono text-[9px] font-bold tracking-[0.2em] text-foreground/25 uppercase mb-1">
                Process Result
              </p>
              <h3 className="text-sm font-bold text-foreground">
                가속으로 확보한 품질 버퍼
              </h3>
              <p className="text-xs text-foreground/38 mt-0.5">
                절약된 60% 공정을 완성도에 재투자
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.8)]" />
              <span className="font-mono text-[9px] font-bold text-emerald-400/80 tracking-[0.15em]">
                VERIFIED
              </span>
            </div>
          </div>

          {/* 60/40 bar */}
          <div className="mb-5">
            <div className="relative h-5 bg-foreground/6 rounded-full overflow-hidden flex">
              <motion.div
                className="h-full bg-brand-secondary/50 flex items-center justify-center flex-shrink-0"
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
                className="h-full bg-silver-metal flex items-center justify-center flex-shrink-0"
                initial={{ width: '0%' }}
                whileInView={{ width: '40%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.0, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                <span className="font-mono text-[9px] font-bold text-white/70 whitespace-nowrap px-2">
                  QUALITY · 40%
                </span>
              </motion.div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="border-t border-foreground/6 pt-4 space-y-2.5">
            {BUFFER_BREAKDOWN.map((item, i) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xs text-foreground/45 w-28 flex-shrink-0">{item.label}</span>
                <div className="flex-1 h-1 bg-foreground/6 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-foreground/20"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.06 * i, ease: 'easeOut' }}
                  />
                </div>
                <span className="font-mono text-[10px] text-foreground/28 tabular-nums w-7 text-right flex-shrink-0">
                  {item.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tech Stack */}
      <div className="w-full mt-14">
        <div className="mb-12 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/28 mb-4 text-center">
            Tech Stack
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            {TECH_STACK.map((t, i) => {
              const Icon = t.Icon
              return (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className={`${THEME_CARD_CLASS} px-4 py-2.5 flex items-center gap-2.5`}
                >
                  <Icon className="w-4 h-4 text-foreground/40 flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground whitespace-nowrap">
                    {t.name}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
