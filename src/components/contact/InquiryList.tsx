import { createClient } from '@/src/utils/supabase/server'
import { InquiryCard } from './InquiryCard'

/**
 * Inquiry List 컴포넌트
 * 
 * 공개된 문의 목록을 표시합니다.
 */
export async function InquiryList() {
  const supabase = await createClient()
  
  // 로그인 유저 확인
  const { data: { user } } = await supabase.auth.getUser()
  let isAdmin = false

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    isAdmin = profile?.role === 'admin'
  }

  // 모든 문의 가져오기 (최신순)
  // 관리자는 모든 문의를 볼 수 있고, 일반 사용자는 공개 문의만 볼 수 있습니다
  let query = supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  // 일반 사용자는 공개 문의만 조회
  if (!isAdmin) {
    query = query.eq('is_public', true)
  }

  const { data: inquiries, error } = await query

  if (error) {
    console.error('Failed to fetch inquiries:', error)
    return null
  }


  return (
    <section className="mt-12">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-5 bg-foreground/30 rounded-full" />
          <h2 className="text-xl font-semibold text-foreground">
          {/* {isAdmin ? '문의내역' : '나의 문의내역'} */}
          {'문의내역'}
        </h2>
      </div>
      {!inquiries || inquiries.length === 0 ? (
        <div className="bg-background border-[0.5px] border-foreground/10 rounded-2xl p-8 text-center">
          <p className="text-sm text-foreground/50">아직 등록된 문의가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-0 bg-background border-[0.5px] border-foreground/10 rounded-2xl overflow-hidden">
          {inquiries.map((inquiry, index) => (
            <div key={inquiry.id}>
              <InquiryCard inquiry={inquiry} isAdmin={isAdmin} />
              {index < inquiries.length - 1 && (
                <div className="border-t border-foreground/8" />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
