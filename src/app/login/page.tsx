'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { loginUser } from '@/src/utils/auth/login'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const errorType = searchParams.get('error')
    if (errorType) {
      const msgs: Record<string, string> = {
        no_session: '로그인이 필요합니다.',
        unauthorized: '관리자 권한이 없습니다. 관리자 계정으로 로그인해주세요.',
        invalid_session: '세션이 유효하지 않습니다. 다시 로그인해주세요.',
      }
      setError(msgs[errorType] || '접근 권한이 없습니다.')
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const result = await loginUser(userId, password)
      if (result.success) {
        const redirectTo = result.role === 'admin' ? (searchParams.get('redirect') || '/admin/dashboard') : '/'
        window.location.href = redirectTo
      } else {
        setError(result.error || '로그인에 실패했습니다.')
        setIsLoading(false)
      }
    } catch {
      setError('로그인 중 오류가 발생했습니다.')
      setIsLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', background: 'var(--bg)' }}>
      <div style={{ width: 380 }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, fontFamily: 'JetBrains Mono, monospace', fontSize: 13, letterSpacing: '0.06em', justifyContent: 'center', color: 'var(--fg)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent-line)', flexShrink: 0 }} />
          SILVER.DEV
        </div>

        <div className="page-context" style={{ textAlign: 'center', marginBottom: 14 }}>관리자 · ADMIN CONSOLE</div>
        <h2 className="h-2 metallic" style={{ textAlign: 'center', margin: '0 0 14px' }}>관리자 로그인</h2>
        <div className="text-muted" style={{ fontSize: 13, textAlign: 'center', marginBottom: 56, lineHeight: 1.6 }}>
          포트폴리오 관리 패널에 접속하세요
        </div>

        {/* URL error */}
        {searchParams.get('error') && (
          <div style={{ marginBottom: 32, padding: '12px 16px', border: '1px solid var(--color-error-border)', background: 'var(--color-error-bg)' }}>
            <p className="sv-mono" style={{ fontSize: 11, color: 'var(--color-error)', letterSpacing: '0.06em' }}>ACCESS DENIED</p>
            <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div>
            <div className="sv-label" style={{ marginBottom: 8 }}>사용자 ID</div>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="admin"
              required
              className="sv-input"
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div className="sv-label" style={{ margin: 0 }}>비밀번호</div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--fg-subtle)', display: 'flex', alignItems: 'center' }}
              >
                {showPassword ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
              </button>
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="sv-input"
            />
          </div>

          {/* Form submit error */}
          {error && !searchParams.get('error') && (
            <div style={{ padding: '10px 14px', border: '1px solid var(--color-error-border)', background: 'var(--color-error-bg)' }}>
              <p style={{ fontSize: 13, color: 'var(--color-error)' }}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 8, opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 14, height: 14, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
                로그인 중...
              </span>
            ) : (
              <>로그인 <span className="arrow">→</span></>
            )}
          </button>
        </form>

        <p className="text-subtle" style={{ fontSize: 12, textAlign: 'center', marginTop: 56, lineHeight: 1.7 }}>
          관리자 계정이 없으신가요?<br />
          <span style={{ color: 'var(--fg-muted)', borderBottom: '1px solid var(--border-strong)' }}>시스템 관리자에게 문의하세요.</span>
        </p>
      </div>
    </div>
  )
}
