import Link from 'next/link'
import { Terminal } from 'lucide-react'

/**
 * 브랜드 로고 컴포넌트
 *
 * - 아이콘 배지: .bg-silver-metal (CSS 변수 기반 메탈 그라데이션, 라이트/다크 자동 전환)
 * - 텍스트: .text-silver-metal (배경-클립 메탈 텍스트, 양 모드에서 선명하게 보임)
 * - whitespace-nowrap + shrink-0 으로 어떤 화면 너비에서도 잘리지 않음
 */
export function Logo() {
  return (
    <Link
      href="/"
      scroll={false}
      className="group inline-flex items-center gap-2 select-none shrink-0 whitespace-nowrap"
      aria-label="Silver.dev 홈으로 이동"
    >
      {/* 아이콘 배지 — CSS 변수 기반 실버 메탈 그라데이션 */}
      <div className="bg-silver-metal flex items-center justify-center w-8 h-8 rounded-lg shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
        <Terminal className="w-4 h-4 text-white dark:text-slate-950" strokeWidth={2.5} />
      </div>

      {/* 브랜드 텍스트 — .text-silver-metal: 라이트(어두운 스틸) / 다크(빛나는 실버) */}
      <span className="text-silver-metal font-black tracking-tighter text-lg leading-none">
        Silver.dev
      </span>
    </Link>
  )
}
