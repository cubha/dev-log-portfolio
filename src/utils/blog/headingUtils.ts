/**
 * 마크다운 텍스트에서 heading id 생성에 사용할 순수 텍스트를 추출한다.
 * - `[Text](url)` 형태의 링크 → Text만 추출
 * - 인라인 코드/강조 등 마크다운 문법 기호 제거
 */
export const markdownTextToPlain = (text: string): string =>
  text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [Text](url) → Text
    .replace(/[`*_~[\]]/g, '')              // 인라인 마크다운 기호 제거
    .trim()

/**
 * 순수 텍스트에서 heading id의 베이스 문자열을 생성한다.
 * MdxComponents.tsx의 getHeadingId() 로직과 동일하게 유지한다.
 */
export const baseIdFromText = (plainText: string): string =>
  plainText
    .toLowerCase()
    .replace(/[^\w\s가-힣-]/g, '')
    .replace(/\s+/g, '-')
