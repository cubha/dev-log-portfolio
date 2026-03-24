import { getTechIcon } from '@/src/utils/techIcons'

interface SkillIconProps {
  /** DB의 name 필드 */
  name: string
  /** DB의 icon_name 필드 — 우선 탐색, 없으면 name으로 폴백 */
  iconName?: string | null
  size?: number
  className?: string
}

/**
 * 기술 스택 아이콘 렌더러
 *
 * 1. icon_name(또는 name)을 techIcons.ts 맵에서 탐색
 * 2. 매핑된 simple-icons 아이콘 렌더링
 * 3. 매핑 실패 시 기술명 첫 두 글자 텍스트 폴백
 *
 * 서버/클라이언트 컴포넌트 모두에서 사용 가능합니다.
 */
export function SkillIcon({ name, iconName, size = 20, className = '' }: SkillIconProps) {
  const iconData = getTechIcon(iconName || name)

  if (iconData) {
    const Icon = iconData.icon
    return (
      <Icon
        style={{ color: iconData.color, width: size, height: size, flexShrink: 0 }}
        className={className}
      />
    )
  }

  // 텍스트 폴백: 이름 첫 두 글자
  const initials = name.slice(0, 2).toUpperCase()
  return (
    <span
      className={`inline-flex items-center justify-center font-bold leading-none text-foreground/50 ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.44), flexShrink: 0 }}
      aria-label={name}
    >
      {initials}
    </span>
  )
}
