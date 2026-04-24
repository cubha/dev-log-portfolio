'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

/**
 * 개별 기술 태그 컴포넌트
 */
interface TechTagProps {
  tech: string
  onRemove: () => void
  getIconUrl: (tech: string) => string
  getTechColor: (tech: string) => string
}

function TechTag({ tech, onRemove, getIconUrl, getTechColor }: TechTagProps) {
  const [iconError, setIconError] = useState(false)

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium group transition-colors ${getTechColor(tech)} hover:opacity-80`}
    >
      {/* Simple Icons 아이콘 */}
      {!iconError ? (
        <Image
          src={getIconUrl(tech)}
          alt={tech}
          width={16}
          height={16}
          unoptimized
          onError={() => setIconError(true)}
        />
      ) : (
        <div className="w-4 h-4 rounded bg-current opacity-30" />
      )}
      <span>{tech}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="ml-0.5 opacity-70 hover:opacity-100 transition-opacity"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

/**
 * 기술 스택 태그 입력 컴포넌트
 *
 * Simple Icons를 활용한 기술 스택 태그 입력 UI입니다.
 * 사용자가 기술명을 입력하면 태그로 추가되고, 각 태그에 아이콘이 표시됩니다.
 */
interface TechStackInputProps {
  value: string[]
  onChange: (techStack: string[]) => void
}

// 인기 기술 스택 목록 (자동완성용) — skills/page.tsx에서도 공유
export const POPULAR_TECHS = [
  // Frontend
  'React',
  'Vue',
  'Angular',
  'Svelte',
  'Next.js',
  'Nuxt.js',
  'Gatsby',
  'Remix',
  'Astro',
  'SvelteKit',
  // Languages
  'TypeScript',
  'JavaScript',
  'Python',
  'Java',
  'Go',
  'Rust',
  'C++',
  'C#',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
  // Styling
  'Tailwind CSS',
  'Bootstrap',
  'Material-UI',
  'Chakra UI',
  'Styled Components',
  'Sass',
  'Less',
  // Backend
  'Node.js',
  'Express',
  'NestJS',
  'FastAPI',
  'Django',
  'Flask',
  'Spring',
  'Laravel',
  'Rails',
  // Database
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'SQLite',
  'Prisma',
  // DevOps & Tools
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'Git',
  'GitHub',
  'GitLab',
  'Jenkins',
  'CI/CD',
  // Services
  'Supabase',
  'Firebase',
  'Vercel',
  'Netlify',
  'Cloudflare',
  // Others
  'GraphQL',
  'REST',
  'Jest',
  'Cypress',
  'Playwright',
  'Figma',
  'Adobe XD',
]

export function TechStackInput({ value, onChange }: TechStackInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 자동완성 필터링
  useEffect(() => {
    if (inputValue.trim().length > 0) {
      const filtered = POPULAR_TECHS.filter(
        tech =>
          tech.toLowerCase().includes(inputValue.toLowerCase()) &&
          !value.includes(tech)
      )
      setSuggestions(filtered.slice(0, 5))
      setShowSuggestions(filtered.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [inputValue, value])

  // 외부 클릭 시 자동완성 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 기술 추가
  const addTech = (tech: string) => {
    const trimmedTech = tech.trim()
    if (trimmedTech && !value.includes(trimmedTech)) {
      onChange([...value, trimmedTech])
      setInputValue('')
      setShowSuggestions(false)
    }
  }

  // 기술 제거
  const removeTech = (techToRemove: string) => {
    onChange(value.filter(tech => tech !== techToRemove))
  }

  // 입력 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  // Enter 키 또는 쉼표 입력 시 태그 추가
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (inputValue.trim()) {
        addTech(inputValue)
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // 빈 입력 상태에서 Backspace 시 마지막 태그 제거
      removeTech(value[value.length - 1])
    }
  }

  // Simple Icons URL 생성 (기술명을 Simple Icons 형식으로 변환)
  const getIconUrl = (tech: string) => {
    // 기술명을 Simple Icons 형식으로 변환
    let iconName = tech.toLowerCase().trim()
    
    // 특수 케이스 처리
    const specialCases: Record<string, string> = {
      'next.js': 'nextdotjs',
      'node.js': 'nodedotjs',
      'c++': 'cplusplus',
      'c#': 'csharp',
      '.net': 'dotnet',
      'tailwind css': 'tailwindcss',
      'material-ui': 'mui',
      'styled components': 'styledcomponents',
      'adobe xd': 'adobexd',
      'ci/cd': 'cicd',
    }
    
    if (specialCases[iconName]) {
      iconName = specialCases[iconName]
    } else {
      // 일반 변환: 공백 제거, 특수문자 처리
      iconName = iconName
        .replace(/\s+/g, '')
        .replace(/\./g, 'dot')
        .replace(/\+/g, 'plus')
        .replace(/#/g, 'sharp')
        .replace(/\//g, '')
        .replace(/[^a-z0-9]/g, '')
    }
    
    return `https://cdn.simpleicons.org/${iconName}`
  }

  // 기술별 브랜드 컬러 (일부 주요 기술)
  const getTechColor = (tech: string): string => {
    const techLower = tech.toLowerCase()
    const colorMap: Record<string, string> = {
      react: 'bg-blue-50 border-blue-200 text-blue-900',
      typescript: 'bg-blue-50 border-blue-200 text-blue-900',
      javascript: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      'next.js': 'bg-gray-50 border-gray-200 text-gray-900',
      'node.js': 'bg-green-50 border-green-200 text-green-900',
      python: 'bg-blue-50 border-blue-200 text-blue-900',
      vue: 'bg-green-50 border-green-200 text-green-900',
      angular: 'bg-red-50 border-red-200 text-red-900',
      'tailwind css': 'bg-cyan-50 border-cyan-200 text-cyan-900',
      docker: 'bg-blue-50 border-blue-200 text-blue-900',
      aws: 'bg-orange-50 border-orange-200 text-orange-900',
      github: 'bg-gray-50 border-gray-200 text-gray-900',
      supabase: 'bg-green-50 border-green-200 text-green-900',
      firebase: 'bg-orange-50 border-orange-200 text-orange-900',
    }

    return colorMap[techLower] || 'bg-blue-50 border-blue-200 text-blue-900'
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-muted mb-2">
        기술 스택
      </label>

      {/* 태그 컨테이너 */}
      <div
        className="min-h-[52px] w-full px-3 py-2 border border-[var(--border)] rounded-lg focus-within:ring-2 focus-within:ring-[var(--border)] transition-all flex flex-wrap gap-2 items-center cursor-text"
        style={{ background: 'var(--bg)' }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* 선택된 태그들 */}
        {value.map((tech, index) => (
          <TechTag
            key={`${tech}-${index}`}
            tech={tech}
            onRemove={() => removeTech(tech)}
            getIconUrl={getIconUrl}
            getTechColor={getTechColor}
          />
        ))}

        {/* 입력 필드 */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? '기술을 입력하세요 (예: React, TypeScript)' : ''}
          className="flex-1 min-w-[200px] outline-none bg-transparent text-sm text-[var(--fg)] placeholder:text-subtle"
        />
      </div>

      {/* 자동완성 제안 */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          {suggestions.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => addTech(tech)}
              className="w-full px-4 py-2 text-left hover:bg-[var(--surface)] flex items-center gap-2 transition-colors group"
            >
              <div className="relative w-4 h-4">
                <Image
                  src={getIconUrl(tech)}
                  alt={tech}
                  width={16}
                  height={16}
                  unoptimized
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
              <span className="text-sm text-muted group-hover:text-[var(--fg)]">{tech}</span>
            </button>
          ))}
        </div>
      )}

      {/* 도움말 텍스트 */}
      <p className="mt-1 text-xs text-subtle">
        Enter 또는 쉼표(,)로 태그를 추가할 수 있습니다. 커스텀 기술명도 입력 가능합니다.
      </p>
    </div>
  )
}
