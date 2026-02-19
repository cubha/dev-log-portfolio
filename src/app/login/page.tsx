'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Lock, User, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import { loginUser } from '@/src/utils/auth/login'

/**
 * 로그인 페이지
 *
 * Supabase Auth 기반 JWT 인증 세션을 생성합니다.
 * user_id와 비밀번호를 입력받아 로그인을 처리합니다.
 */
export default function LoginPage() {
  const searchParams = useSearchParams()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // URL 파라미터에서 보안 에러 확인
  useEffect(() => {
    const errorType = searchParams.get('error')
    if (errorType) {
      const errorMessages: Record<string, string> = {
        no_session: '로그인이 필요합니다.',
        unauthorized: '관리자 권한이 없습니다. 관리자 계정으로 로그인해주세요.',
        invalid_session: '세션이 유효하지 않습니다. 다시 로그인해주세요.',
      }
      setError(errorMessages[errorType] || '접근 권한이 없습니다.')
    }
  }, [searchParams])

  // 로그인 처리 함수
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // 서버 액션으로 로그인 처리
      const result = await loginUser(userId, password)

      if (result.success) {
        // 역할에 따라 리다이렉트 (전체 새로고침으로 미들웨어 재검증)
        if (result.role === 'admin') {
          const redirectTo = searchParams.get('redirect') || '/admin/dashboard'
          window.location.href = redirectTo
        } else {
          window.location.href = '/'
        }
      } else {
        setError(result.error || '로그인에 실패했습니다.')
        setIsLoading(false)
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.')
      console.error('로그인 오류:', err)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-silver-metal rounded-2xl mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">관리자 로그인</h1>
          <p className="text-foreground/60">포트폴리오 관리 패널에 접속하세요</p>
        </div>

        {/* 보안 경고 메시지 */}
        {searchParams.get('error') && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-800">접근 거부</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 로그인 폼 */}
        <div className="bg-background rounded-2xl shadow-xl border border-foreground/10 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* 사용자 ID 입력 */}
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-foreground/70 mb-2">
                사용자 ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-foreground/40" />
                </div>
                <input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="admin"
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-background border border-foreground/20 rounded-lg focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all text-foreground"
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground/70 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-foreground/40" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="block w-full pl-10 pr-12 py-3 bg-background border border-foreground/20 rounded-lg focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all text-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground/40 hover:text-foreground/70"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* 에러 메시지 (폼 제출 시) */}
            {error && !searchParams.get('error') && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-silver-metal animate-shine text-white dark:text-slate-950 font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  로그인 중...
                </span>
              ) : (
                '로그인'
              )}
            </button>
          </form>

        </div>

        {/* 안내 메시지 */}
        <div className="mt-6 text-center">
          <p className="text-xs text-foreground/50">
            관리자 계정이 없으신가요? 시스템 관리자에게 문의하세요.
          </p>
        </div>
      </div>
    </div>
  )
}
