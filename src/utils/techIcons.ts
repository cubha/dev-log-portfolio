import * as SimpleIcons from 'react-icons/si'
import { IconType } from 'react-icons'

/**
 * 기술 스택 아이콘 매핑 유틸리티
 *
 * 기술명을 react-icons/si (Simple Icons) 아이콘 컴포넌트로 매핑합니다.
 * 매칭되지 않는 기술은 null을 반환하여 호출부에서 폴백 처리합니다.
 */

// 매핑 타입 정의
type IconMapping = { key: keyof typeof SimpleIcons; color: string }

const ICON_MAP: Record<string, IconMapping> = {
  // ── Frontend ──────────────────────────
  'nextjs':           { key: 'SiNextdotjs',        color: '#000000' },
  'next':             { key: 'SiNextdotjs',        color: '#000000' },
  'nextjs15':         { key: 'SiNextdotjs',        color: '#000000' },
  'react':            { key: 'SiReact',            color: '#61DAFB' },
  'reactjs':          { key: 'SiReact',            color: '#61DAFB' },
  'reactnative':      { key: 'SiReact',            color: '#61DAFB' },
  'vue':              { key: 'SiVuedotjs',         color: '#4FC08D' },
  'vuejs':            { key: 'SiVuedotjs',         color: '#4FC08D' },
  'angular':          { key: 'SiAngular',          color: '#DD0031' },
  'svelte':           { key: 'SiSvelte',           color: '#FF3E00' },

  // ── Languages ─────────────────────────
  'typescript':       { key: 'SiTypescript',       color: '#3178C6' },
  'javascript':       { key: 'SiJavascript',       color: '#F7DF1E' },
  'python':           { key: 'SiPython',           color: '#3776AB' },
  'java':             { key: 'SiOpenjdk',          color: '#007396' },
  'csharp':           { key: 'SiSharp',            color: '#239120' },
  'c#':               { key: 'SiSharp',            color: '#239120' },
  'go':               { key: 'SiGo',               color: '#00ADD8' },
  'golang':           { key: 'SiGo',               color: '#00ADD8' },
  'rust':             { key: 'SiRust',             color: '#000000' },
  'php':              { key: 'SiPhp',              color: '#777BB4' },
  'ruby':             { key: 'SiRuby',             color: '#CC342D' },
  'kotlin':           { key: 'SiKotlin',           color: '#7F52FF' },
  'swift':            { key: 'SiSwift',            color: '#FA7343' },

  // ── Backend & Frameworks ──────────────
  'nodejs':           { key: 'SiNodedotjs',        color: '#339933' },
  'node':             { key: 'SiNodedotjs',        color: '#339933' },
  'express':          { key: 'SiExpress',          color: '#000000' },
  'expressjs':        { key: 'SiExpress',          color: '#000000' },
  'nestjs':           { key: 'SiNestjs',           color: '#E0234E' },
  'nest':             { key: 'SiNestjs',           color: '#E0234E' },
  'django':           { key: 'SiDjango',           color: '#092E20' },
  'flask':            { key: 'SiFlask',            color: '#000000' },
  'fastapi':          { key: 'SiFastapi',          color: '#009688' },
  'spring':           { key: 'SiSpring',           color: '#6DB33F' },
  'springboot':       { key: 'SiSpringboot',       color: '#6DB33F' },
  'laravel':          { key: 'SiLaravel',          color: '#FF2D20' },
  'rails':            { key: 'SiRubyonrails',      color: '#CC0000' },
  'rubyonrails':      { key: 'SiRubyonrails',      color: '#CC0000' },

  // ── Databases ─────────────────────────
  'supabase':         { key: 'SiSupabase',         color: '#3ECF8E' },
  'postgresql':       { key: 'SiPostgresql',       color: '#4169E1' },
  'postgres':         { key: 'SiPostgresql',       color: '#4169E1' },
  'mysql':            { key: 'SiMysql',            color: '#4479A1' },
  'mongodb':          { key: 'SiMongodb',          color: '#47A248' },
  'mongo':            { key: 'SiMongodb',          color: '#47A248' },
  'redis':            { key: 'SiRedis',            color: '#DC382D' },
  'sqlite':           { key: 'SiSqlite',           color: '#003B57' },
  'mariadb':          { key: 'SiMariadb',          color: '#003545' },
  'oracle':           { key: 'SiOracle',           color: '#F80000' },
  'firebase':         { key: 'SiFirebase',         color: '#FFCA28' },

  // ── Styling ───────────────────────────
  'tailwindcss':      { key: 'SiTailwindcss',      color: '#06B6D4' },
  'tailwind':         { key: 'SiTailwindcss',      color: '#06B6D4' },
  'sass':             { key: 'SiSass',             color: '#CC6699' },
  'scss':             { key: 'SiSass',             color: '#CC6699' },
  'css':              { key: 'SiCss3',             color: '#1572B6' },
  'html':             { key: 'SiHtml5',            color: '#E34F26' },
  'styledcomponents':  { key: 'SiStyledcomponents',  color: '#DB7093' },

  // ── Tools & Platforms ─────────────────
  'docker':           { key: 'SiDocker',           color: '#2496ED' },
  'kubernetes':       { key: 'SiKubernetes',       color: '#326CE5' },
  'k8s':              { key: 'SiKubernetes',       color: '#326CE5' },
  'aws':              { key: 'SiAmazonwebservices', color: '#FF9900' },
  'gcp':              { key: 'SiGooglecloud',      color: '#4285F4' },
  'vercel':           { key: 'SiVercel',           color: '#000000' },
  'netlify':          { key: 'SiNetlify',          color: '#00C7B7' },
  'heroku':           { key: 'SiHeroku',           color: '#430098' },
  'git':              { key: 'SiGit',              color: '#F05032' },
  'github':           { key: 'SiGithub',           color: '#181717' },
  'gitlab':           { key: 'SiGitlab',           color: '#FC6D26' },
  'bitbucket':        { key: 'SiBitbucket',        color: '#0052CC' },
  'figma':            { key: 'SiFigma',            color: '#F24E1E' },
  'notion':           { key: 'SiNotion',           color: '#000000' },
  'slack':            { key: 'SiSlack',            color: '#4A154B' },
  'jira':             { key: 'SiJira',             color: '#0052CC' },

  // ── Animation & Motion ────────────────
  'framermotion':     { key: 'SiFramer',           color: '#0055FF' },
  'framer':           { key: 'SiFramer',           color: '#0055FF' },

  // ── State Management ──────────────────
  'redux':            { key: 'SiRedux',            color: '#764ABC' },
  'mobx':             { key: 'SiMobx',             color: '#FF9955' },
  'recoil':           { key: 'SiRecoil',           color: '#3578E5' },
  'jotai':            { key: 'SiReact',            color: '#000000' },

  // ── Testing ───────────────────────────
  'jest':             { key: 'SiJest',             color: '#C21325' },
  'cypress':          { key: 'SiCypress',          color: '#17202C' },
}

/**
 * 기술명으로 아이콘과 브랜드 색상을 조회합니다.
 *
 * @param techName - 기술 스택 이름 (예: "Next.js 15", "TypeScript")
 * @returns `{ icon, color }` 또는 매칭 실패 시 `null`
 */
export function getTechIcon(techName: string): { icon: IconType; color: string } | null {
  const normalized = techName.toLowerCase().replace(/[.\s\-_0-9]/g, '')
  const mapping = ICON_MAP[normalized]

  if (mapping) {
    const IconComponent = SimpleIcons[mapping.key] as IconType | undefined
    if (IconComponent) {
      return { icon: IconComponent, color: mapping.color }
    }
  }

  return null
}
