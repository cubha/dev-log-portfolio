import { createClient } from '@/src/utils/supabase/client'

/**
 * Supabase Storage에 이미지를 업로드하고 Public URL을 반환합니다.
 *
 * @param file - 업로드할 이미지 파일
 * @param bucket - Storage 버킷 이름 (기본값: 'project-images')
 * @returns Public URL 문자열
 * @throws 업로드 실패 시 에러
 */
export async function uploadImage(
  file: File,
  bucket: string = 'project-images'
): Promise<string> {
  const supabase = createClient()

  // 파일명 생성: 타임스탬프 + 원본 파일명으로 중복 방지
  const timestamp = Date.now()
  const fileExt = file.name.split('.').pop()
  const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

  // Supabase Storage에 업로드
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false, // 중복 파일 덮어쓰기 방지
    })

  if (error) {
    console.error('이미지 업로드 오류:', error)
    throw new Error(`이미지 업로드에 실패했습니다: ${error.message}`)
  }

  // Public URL 생성
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return publicUrl
}

/**
 * Supabase Storage에서 이미지를 삭제합니다.
 *
 * @param url - 삭제할 이미지의 Public URL
 * @param bucket - Storage 버킷 이름 (기본값: 'project-images')
 */
export async function deleteImage(
  url: string,
  bucket: string = 'project-images'
): Promise<void> {
  const supabase = createClient()

  // URL에서 파일 경로 추출
  // 예: https://xxx.supabase.co/storage/v1/object/public/project-images/filename.jpg
  // → filename.jpg
  const urlParts = url.split(`/${bucket}/`)
  if (urlParts.length < 2) {
    throw new Error('잘못된 이미지 URL 형식입니다.')
  }
  const filePath = urlParts[1]

  // Supabase Storage에서 삭제
  const { error } = await supabase.storage.from(bucket).remove([filePath])

  if (error) {
    console.error('이미지 삭제 오류:', error)
    throw new Error(`이미지 삭제에 실패했습니다: ${error.message}`)
  }
}
