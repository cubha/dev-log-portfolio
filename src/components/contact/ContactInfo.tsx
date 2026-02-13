'use client'

import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi'
import { SiGithub } from 'react-icons/si'

/**
 * Contact Info 컴포넌트
 * 
 * 연락처 정보를 Blue-Purple 그라데이션으로 강조한 카드 형태로 표시합니다.
 */
export function ContactInfo() {
  const contactItems = [
    {
      icon: HiOutlineMail,
      label: 'Email',
      value: '[REMOVED]',
      copyable: true,
    },
    {
      icon: HiOutlinePhone,
      label: 'Phone',
      value: '[REMOVED]',
      copyable: false,
    },
    {
      icon: HiOutlineLocationMarker,
      label: 'Location',
      value: 'Seoul, Republic of Korea',
      copyable: false,
    },
    {
      icon: SiGithub,
      label: 'GitHub',
      value: 'View Profile',
      copyable: false,
      href: 'https://github.com/yourusername',
    },
  ]

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('복사되었습니다!')
  }

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
        <h2 className="text-xl font-semibold text-gray-900">Contact Info</h2>
      </div>
      <div className="bg-white border-[0.5px] border-gray-100 rounded-2xl p-6 h-[350px] flex flex-col justify-center">
        <div className="space-y-4">
          {contactItems.map((item) => {
            const Icon = item.icon
            const content = (
              <div className="flex items-center gap-3 py-2">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500">{item.label}</div>
                  <div className="text-sm text-gray-900 font-medium truncate">{item.value}</div>
                </div>
                {item.copyable && (
                  <button
                    onClick={() => handleCopy(item.value)}
                    className="text-xs text-gray-500 hover:text-gray-900 transition-colors px-2"
                  >
                    Copy
                  </button>
                )}
              </div>
            )

            if (item.href) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:bg-gray-50 rounded-lg transition-colors px-2 -mx-2"
                >
                  {content}
                </a>
              )
            }

            return <div key={item.label} className="px-2 -mx-2">{content}</div>
          })}
        </div>
      </div>
    </section>
  )
}
