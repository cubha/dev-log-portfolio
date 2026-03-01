import React from 'react'
import * as si from 'simple-icons'
import type { SimpleIcon } from 'simple-icons'

/**
 * 기술 스택 아이콘 매핑 유틸리티
 *
 * 기술명을 simple-icons 아이콘으로 매핑합니다.
 * 매칭되지 않는 기술은 null을 반환하여 호출부에서 폴백 처리합니다.
 */

// simple-icons의 named export 키 형식: 'si' + PascalCase (예: siReact, siNextdotjs)
type IconMapping = { key: string; color: string }

const ICON_MAP: Record<string, IconMapping> = {
  // ── Frontend ──────────────────────────
  nextjs: { key: 'nextdotjs', color: '#000000' },
  next: { key: 'nextdotjs', color: '#000000' },
  nextjs15: { key: 'nextdotjs', color: '#000000' },
  react: { key: 'react', color: '#61DAFB' },
  reactjs: { key: 'react', color: '#61DAFB' },
  reactnative: { key: 'react', color: '#61DAFB' },
  vue: { key: 'vuedotjs', color: '#4FC08D' },
  vuejs: { key: 'vuedotjs', color: '#4FC08D' },
  angular: { key: 'angular', color: '#DD0031' },
  svelte: { key: 'svelte', color: '#FF3E00' },

  // ── Languages ─────────────────────────
  typescript: { key: 'typescript', color: '#3178C6' },
  javascript: { key: 'javascript', color: '#F7DF1E' },
  python: { key: 'python', color: '#3776AB' },
  java: { key: 'openjdk', color: '#007396' },
  csharp: { key: 'csharp', color: '#239120' },
  'c#': { key: 'csharp', color: '#239120' },
  go: { key: 'go', color: '#00ADD8' },
  golang: { key: 'go', color: '#00ADD8' },
  rust: { key: 'rust', color: '#000000' },
  php: { key: 'php', color: '#777BB4' },
  ruby: { key: 'ruby', color: '#CC342D' },
  kotlin: { key: 'kotlin', color: '#7F52FF' },
  swift: { key: 'swift', color: '#FA7343' },

  // ── Backend & Frameworks ──────────────
  nodejs: { key: 'nodedotjs', color: '#339933' },
  node: { key: 'nodedotjs', color: '#339933' },
  express: { key: 'express', color: '#000000' },
  expressjs: { key: 'express', color: '#000000' },
  nestjs: { key: 'nestjs', color: '#E0234E' },
  nest: { key: 'nestjs', color: '#E0234E' },
  django: { key: 'django', color: '#092E20' },
  flask: { key: 'flask', color: '#000000' },
  fastapi: { key: 'fastapi', color: '#009688' },
  spring: { key: 'spring', color: '#6DB33F' },
  springboot: { key: 'springboot', color: '#6DB33F' },
  laravel: { key: 'laravel', color: '#FF2D20' },
  rails: { key: 'rubyonrails', color: '#CC0000' },
  rubyonrails: { key: 'rubyonrails', color: '#CC0000' },

  // ── Databases ─────────────────────────
  supabase: { key: 'supabase', color: '#3ECF8E' },
  postgresql: { key: 'postgresql', color: '#4169E1' },
  postgres: { key: 'postgresql', color: '#4169E1' },
  mysql: { key: 'mysql', color: '#4479A1' },
  mongodb: { key: 'mongodb', color: '#47A248' },
  mongo: { key: 'mongodb', color: '#47A248' },
  redis: { key: 'redis', color: '#DC382D' },
  sqlite: { key: 'sqlite', color: '#003B57' },
  mariadb: { key: 'mariadb', color: '#003545' },
  oracle: { key: 'oracle', color: '#F80000' },
  firebase: { key: 'firebase', color: '#FFCA28' },

  // ── Styling ───────────────────────────
  tailwindcss: { key: 'tailwindcss', color: '#06B6D4' },
  tailwind: { key: 'tailwindcss', color: '#06B6D4' },
  sass: { key: 'sass', color: '#CC6699' },
  scss: { key: 'sass', color: '#CC6699' },
  css: { key: 'css3', color: '#1572B6' },
  html: { key: 'html5', color: '#E34F26' },
  styledcomponents: { key: 'styledcomponents', color: '#DB7093' },

  // ── Tools & Platforms ─────────────────
  docker: { key: 'docker', color: '#2496ED' },
  kubernetes: { key: 'kubernetes', color: '#326CE5' },
  k8s: { key: 'kubernetes', color: '#326CE5' },
  aws: { key: 'amazonwebservices', color: '#FF9900' },
  gcp: { key: 'googlecloud', color: '#4285F4' },
  vercel: { key: 'vercel', color: '#000000' },
  netlify: { key: 'netlify', color: '#00C7B7' },
  heroku: { key: 'heroku', color: '#430098' },
  git: { key: 'git', color: '#F05032' },
  github: { key: 'github', color: '#181717' },
  gitlab: { key: 'gitlab', color: '#FC6D26' },
  bitbucket: { key: 'bitbucket', color: '#0052CC' },
  figma: { key: 'figma', color: '#F24E1E' },
  notion: { key: 'notion', color: '#000000' },
  slack: { key: 'slack', color: '#4A154B' },
  jira: { key: 'jira', color: '#0052CC' },

  // ── Animation & Motion ────────────────
  framermotion: { key: 'framer', color: '#0055FF' },
  framer: { key: 'framer', color: '#0055FF' },

  // ── State Management ──────────────────
  redux: { key: 'redux', color: '#764ABC' },
  mobx: { key: 'mobx', color: '#FF9955' },
  recoil: { key: 'recoil', color: '#3578E5' },
  jotai: { key: 'react', color: '#000000' },

  // ── Testing ───────────────────────────
  jest: { key: 'jest', color: '#C21325' },
  cypress: { key: 'cypress', color: '#17202C' },
}

/**
 * 기술명으로 아이콘과 브랜드 색상을 조회합니다.
 *
 * @param techName - 기술 스택 이름 (예: "Next.js 15", "TypeScript")
 * @returns `{ icon, color }` 또는 매칭 실패 시 `null`
 */
export function getTechIcon(
  techName: string
): { icon: React.FC<{ className?: string; style?: React.CSSProperties }>; color: string } | null {
  const normalized = techName.toLowerCase().replace(/[.\s\-_0-9]/g, '')
  const mapping = ICON_MAP[normalized]
  if (!mapping) return null

  // simple-icons의 named export 키: 'si' + mapping.key (첫 글자 대문자로 변환)
  const iconKey =
    'si' + mapping.key.charAt(0).toUpperCase() + mapping.key.slice(1)
  const simpleIcon = (si as Record<string, SimpleIcon>)[iconKey]
  if (!simpleIcon) return null

  // SVG path → React 인라인 컴포넌트 생성
  const Icon: React.FC<{
    className?: string
    style?: React.CSSProperties
  }> = ({ className, style }) =>
    React.createElement(
      'svg',
      {
        role: 'img',
        viewBox: '0 0 24 24',
        xmlns: 'http://www.w3.org/2000/svg',
        className,
        style,
        fill: 'currentColor',
      },
      React.createElement('path', { d: simpleIcon.path })
    )
  Icon.displayName = simpleIcon.title

  return { icon: Icon, color: mapping.color }
}
