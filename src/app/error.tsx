'use client'

import { useEffect } from 'react'

/**
 * 에러 바운더리 컴포넌트
 * 
 * Next.js 15에서 예상치 못한 런타임 에러를 잡아 처리합니다.
 * 무한 새로고침 문제를 방지하기 위해 에러를 안전하게 표시합니다.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 에러를 로깅합니다
    console.error('에러 바운더리에서 잡힌 에러:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-background rounded-lg shadow-lg border border-foreground/10 p-8 text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            오류가 발생했습니다
          </h2>
          <p className="text-foreground/60 mb-6">
            페이지를 불러오는 중 문제가 발생했습니다.
          </p>
          <div className="mb-6 p-4 bg-foreground/5 rounded-md">
            <p className="text-sm text-foreground/70 font-mono">
              {error.message || '알 수 없는 오류'}
            </p>
          </div>
          <button
            onClick={reset}
            className="w-full px-6 py-3 bg-brand-primary text-white rounded-lg hover:opacity-90 transition-all font-medium"
          >
            다시 시도
          </button>
        </div>
      </div>
    </div>
  )
}
