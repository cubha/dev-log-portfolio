import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

/**
 * 뒤로가기 버튼 컴포넌트
 * 
 * 메인 페이지로 이동하는 네비게이션 버튼입니다.
 * 호버 시 좌측으로 이동하는 애니메이션과 아이콘 펄스 효과가 적용됩니다.
 */
export function BackButton() {
  return (
    <div className="mb-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:-translate-x-1 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:animate-pulse" />
        <span className="font-medium">메인으로</span>
      </Link>
    </div>
  )
}
