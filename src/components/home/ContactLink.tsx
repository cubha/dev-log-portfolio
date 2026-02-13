'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { HiOutlineMail } from 'react-icons/hi'

/**
 * Contact 페이지로 이동하는 링크
 */
export function ContactLink() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="text-center"
    >
      <Link href="/contact" className="group inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
        <HiOutlineMail className="w-4 h-4" />
        <span className="text-sm">문의하기</span>
        <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    </motion.div>
  )
}
