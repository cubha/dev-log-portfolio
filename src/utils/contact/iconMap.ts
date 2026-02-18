import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi'
import { SiGithub } from 'react-icons/si'
import type { IconType } from 'react-icons'

/**
 * DB의 icon_key 문자열 → react-icons 컴포넌트 매핑
 *
 * DB에는 문자열(예: 'mail')만 저장되고,
 * 실제 아이콘 컴포넌트는 이 맵을 통해 클라이언트에서 결정합니다.
 *
 * 새로운 아이콘을 추가하려면 이 맵에 항목만 추가하면 됩니다.
 */
export const ICON_MAP: Record<string, IconType> = {
  mail: HiOutlineMail,
  phone: HiOutlinePhone,
  location: HiOutlineLocationMarker,
  github: SiGithub,
} as const

/** icon_key로 아이콘 컴포넌트를 가져옵니다. 매핑이 없으면 mail 아이콘을 반환합니다. */
export function getContactIcon(iconKey: string): IconType {
  return ICON_MAP[iconKey] ?? HiOutlineMail
}
