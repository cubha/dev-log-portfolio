import { ADJECTIVES } from './adjectives'
import { ANIMALS } from './animals'

const STORAGE_KEY = 'guest_nickname'

/** 형용사 + 동물 조합으로 랜덤 닉네임 생성 */
export function generateGuestNickname(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
  return `${adj} ${animal}`
}

/**
 * localStorage에 저장된 닉네임이 있으면 반환, 없으면 생성 후 저장
 * (브라우저 환경에서만 호출할 것)
 */
export function getOrCreateGuestNickname(): string {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) return stored
  const generated = generateGuestNickname()
  localStorage.setItem(STORAGE_KEY, generated)
  return generated
}

/** 새 닉네임을 생성하고 localStorage에 저장 후 반환 */
export function refreshGuestNickname(): string {
  const generated = generateGuestNickname()
  localStorage.setItem(STORAGE_KEY, generated)
  return generated
}

export { STORAGE_KEY }
