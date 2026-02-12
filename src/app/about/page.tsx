import { createClient } from '@/src/utils/supabase/server'
import { BackButton } from '@/src/components/common/BackButton'
import { FloatingUserButton } from '@/src/components/common/FloatingAdminButton'
import { AboutContent } from '@/src/components/about/AboutContent'
import Link from 'next/link'
import type { AboutProfile } from '@/src/types/profile'

/**
 * About 페이지
 * 
 * 개발자 프로필을 표시하는 공개 페이지입니다.
 * 관리자는 우측 하단 플로팅 버튼을 통해 프로필을 편집할 수 있습니다.
 */
export default async function AboutPage() {
  const supabase = await createClient()
  
  // 로그인 상태 및 권한 확인
  const { data: { user } } = await supabase.auth.getUser()
  let userRole = 'guest'
  let isAdmin = false

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    userRole = profile?.role || 'user'
    isAdmin = userRole === 'admin'
  }

  // 프로필 데이터 조회
  let profileData: AboutProfile | null = null
  
  try {
    const { data, error } = await supabase
      .from('about_profiles')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (!error && data) {
      profileData = data as AboutProfile
    }
  } catch (error) {
    console.error('프로필 조회 오류:', error)
  }

  return (
    <main className="container mx-auto px-4 py-8 pt-24">
      <BackButton />

      <div className="max-w-4xl mx-auto">
        {/* 동적 콘텐츠 */}
        <AboutContent profile={profileData} />

        {/* 관리자 안내 - 프로필이 없을 때만 표시 */}
        {isAdmin && !profileData && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mt-8">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <span className="text-2xl">✏️</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">
                  프로필을 작성해보세요!
                </h3>
                <p className="text-blue-800 mb-4">
                  관리자 페이지에서 프로필 정보를 입력하면 이 페이지에 표시됩니다.
                </p>
                <Link
                  href="/admin/profile"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>프로필 편집하기</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 로그인 유저: 플로팅 메뉴 */}
      {userRole !== 'guest' && <FloatingUserButton isAdmin={isAdmin} />}
    </main>
  )
}
