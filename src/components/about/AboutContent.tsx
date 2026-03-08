'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { User, X, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { AboutProfile } from '@/src/types/profile'
import { ThemeCard } from '@/src/components/common/ThemeCard'

interface AboutContentProps {
  profile: AboutProfile | null
}

export function AboutContent({ profile }: AboutContentProps) {
  const [isImageExpanded, setIsImageExpanded] = useState(false)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isImageExpanded) setIsImageExpanded(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isImageExpanded])

  useEffect(() => {
    document.body.style.overflow = isImageExpanded ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isImageExpanded])

  if (!profile) {
    return (
      <ThemeCard className="p-8 mb-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">프로필이 없습니다</h2>
          <p className="text-foreground/60">아직 등록된 프로필이 없습니다.</p>
        </div>
      </ThemeCard>
    )
  }

  const visibleStorySections = (profile.story_json ?? []).filter(
    (section) => section.isVisible !== false
  )

  return (
    <>
      {/* Hero section */}
      <section className="relative flex flex-col justify-center py-24 mb-8 overflow-hidden">
        {/* Effects layer — edges fade out smoothly */}
        <div className="effects-fade">
          <div
            className="ambient-glow"
            style={{ width: 500, height: 500, top: '-15%', right: '-10%' }}
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:gap-12 text-center md:text-left">

          {/* Profile image */}
          <div className="flex-shrink-0 flex justify-center md:justify-start mb-8 md:mb-0">
            {profile.profile_image_url ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => setIsImageExpanded(true)}
                className="cursor-pointer rounded-full p-[2px] bg-gradient-to-br from-foreground/10 to-foreground/5"
                style={{ width: 180, height: 180 }}
                aria-label="프로필 이미지 확대"
              >
                <div className="relative w-full h-full rounded-full overflow-hidden bg-background">
                  <Image
                    src={profile.profile_image_url}
                    alt="프로필"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="rounded-full p-[2px] bg-gradient-to-br from-foreground/10 to-foreground/5"
                style={{ width: 180, height: 180 }}
              >
                <div className="w-full h-full bg-foreground/8 rounded-full flex items-center justify-center">
                  <User className="w-16 h-16 text-foreground/25" />
                </div>
              </motion.div>
            )}
          </div>

          {/* Text block */}
          <div className="flex-1 min-w-0">
            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-2 mb-4 justify-center md:justify-start"
            >
              <MapPin className="w-3 h-3 text-foreground/30" />
              <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-foreground/30">
                Seoul, Korea
              </span>
            </motion.div>

            {/* Main copy */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
              className="font-bold text-foreground mb-4 tracking-tight"
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                lineHeight: 1.15,
              }}
            >
              {profile.main_copy}
            </motion.h1>

            {/* Intro text */}
            {profile.intro_text && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.48 }}
                className="text-sm text-foreground/55 leading-relaxed max-w-lg"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {profile.intro_text}
              </motion.p>
            )}
          </div>
        </div>
      </section>

      {/* Image expand modal — fixed center, z-[9999] */}
      <AnimatePresence>
        {isImageExpanded && profile.profile_image_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsImageExpanded(false)}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-zoom-out"
          >
            <button
              onClick={() => setIsImageExpanded(false)}
              className="absolute top-6 right-6 z-10 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
              aria-label="닫기"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg aspect-square cursor-default"
            >
              <Image
                src={profile.profile_image_url}
                alt="프로필 확대"
                fill
                className="object-contain rounded-2xl"
                priority
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-8 text-white/50 text-sm"
            >
              클릭하거나 ESC를 눌러 닫기
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Story sections */}
      <AnimatePresence>
        {visibleStorySections.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4 mb-8"
          >
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-xl font-bold text-foreground mb-6"
            >
              About Me
            </motion.h2>

            <div className="space-y-4">
              {visibleStorySections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                    delay: index * 0.06,
                  }}
                >
                  <ThemeCard className="p-5">
                    <h3 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
                      {section.icon && (
                        <span className="text-lg w-6 text-center">{section.icon}</span>
                      )}
                      {section.title}
                    </h3>
                    <p className="text-sm text-foreground/55 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </p>
                  </ThemeCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
