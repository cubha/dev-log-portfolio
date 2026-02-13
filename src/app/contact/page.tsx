import { BackButton } from '@/src/components/common/BackButton'
import { ContactInfo } from '@/src/components/contact/ContactInfo'
import { InquiryForm } from '@/src/components/contact/InquiryForm'
import { InquiryList } from '@/src/components/contact/InquiryList'

/**
 * Contact 페이지
 * 
 * 좌측: Contact Info (이메일, 전화번호, 위치, GitHub)
 * 우측: Inquiry Form (문의 작성)
 * 하단: 공개된 문의 목록
 */
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <BackButton />
        
        {/* 페이지 헤더 */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Contact
          </h1>
        </div>

        {/* 2열 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* 좌측: Contact Info */}
          <ContactInfo />
          
          {/* 우측: Inquiry Form */}
          <InquiryForm />
        </div>

        {/* 하단: 공개된 문의 목록 */}
        <InquiryList />
      </div>
    </div>
  )
}
