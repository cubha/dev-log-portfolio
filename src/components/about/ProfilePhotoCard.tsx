'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { User, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ProfilePhotoCardProps {
  imageUrl: string | null
}

export function ProfilePhotoCard({ imageUrl }: ProfilePhotoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isExpanded ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isExpanded])

  return (
    <>
      {imageUrl ? (
        <motion.button
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => setIsExpanded(true)}
          style={{
            all: 'unset',
            display: 'block',
            width: '80%',
            aspectRatio: '1',
            borderRadius: '50%',
            background: 'var(--metal-border)',
            padding: 2,
            cursor: 'zoom-in',
          }}
          aria-label="프로필 이미지 확대"
        >
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            overflow: 'hidden',
            background: 'var(--bg-1)',
            position: 'relative',
          }}>
            <Image
              src={imageUrl}
              alt="프로필"
              fill
              sizes="240px"
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        </motion.button>
      ) : (
        <div style={{
          width: '100%',
          aspectRatio: '1',
          borderRadius: '50%',
          background: 'var(--metal-border)',
          padding: 2,
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'var(--bg-1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <User style={{ width: '38%', height: '38%', color: 'var(--fg-subtle)' }} />
          </div>
        </div>
      )}

      {mounted && createPortal(
        <AnimatePresence>
          {isExpanded && imageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
              background: 'rgba(0,0,0,0.82)',
              backdropFilter: 'blur(12px)',
              cursor: 'zoom-out',
            }}
          >
            <button
              onClick={() => setIsExpanded(false)}
              style={{
                position: 'absolute',
                top: 24,
                right: 24,
                padding: 12,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                color: 'white',
              }}
              aria-label="닫기"
            >
              <X style={{ width: 24, height: 24 }} />
            </button>

            <motion.div
              initial={{ scale: 0.86, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.86, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: 'min(72vw, 72vh)',
                height: 'min(72vw, 72vh)',
                borderRadius: '50%',
                background: 'var(--metal-border)',
                padding: 4,
                flexShrink: 0,
                cursor: 'default',
              }}
            >
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
                position: 'relative',
              }}>
                <Image
                  src={imageUrl}
                  alt="프로필 확대"
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                position: 'absolute',
                bottom: 32,
                fontSize: 13,
                color: 'rgba(255,255,255,0.4)',
                fontFamily: 'JetBrains Mono, monospace',
                letterSpacing: '0.06em',
              }}
            >
              ESC 또는 클릭으로 닫기
            </motion.p>
          </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
