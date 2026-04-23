'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export const ReadingProgressBar = () => {
  const [progress, setProgress] = useState(0)
  const scaleX = useSpring(0, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement
      const scrollTop = el.scrollTop
      const scrollHeight = el.scrollHeight - el.clientHeight
      if (scrollHeight > 0) {
        setProgress(scrollTop / scrollHeight)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    scaleX.set(progress)
  }, [progress, scaleX])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-foreground/70 origin-left z-[60]"
      style={{ scaleX }}
    />
  )
}
