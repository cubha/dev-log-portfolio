/**
 * Supabase 데이터베이스 타입 정의
 * 
 * 이 파일은 Supabase 데이터베이스의 테이블 구조를 TypeScript 타입으로 정의합니다.
 * 실제 데이터베이스 스키마와 일치하도록 유지해야 합니다.
 */

// ============================================
// Database 타입 정의
// ============================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
      }
      skills: {
        Row: Skill
        Insert: Omit<Skill, 'id' | 'created_at'>
        Update: Partial<Omit<Skill, 'id' | 'created_at'>>
      }
    }
  }
}

// ============================================
// Profile 타입 정의
// ============================================

export interface Profile {
  /** 사용자 UUID (auth.users 테이블과 연결) */
  id: string
  /** 사용자명 (고유값) */
  username: string | null
  /** 전체 이름 */
  full_name: string | null
  /** 아바타 이미지 URL */
  avatar_url: string | null
  /** 자기소개 */
  bio: string | null
  /** GitHub 프로필 URL */
  github_url: string | null
  /** LinkedIn 프로필 URL */
  linkedin_url: string | null
  /** 개인 웹사이트 URL */
  website_url: string | null
  /** 생성일시 */
  created_at: string
  /** 수정일시 */
  updated_at: string
}

// ============================================
// Project 타입 정의
// ============================================

export interface Project {
  /** 프로젝트 UUID */
  id: string
  /** 프로필 ID (profiles 테이블 참조) */
  profile_id: string | null
  /** 프로젝트 제목 */
  title: string
  /** 프로젝트 설명 */
  description: string | null
  /** 프로젝트 상세 내용 (마크다운 형식) */
  content: string | null
  /** 썸네일 이미지 URL */
  thumbnail_url: string | null
  /** GitHub 저장소 URL */
  github_url: string | null
  /** 데모 사이트 URL */
  demo_url: string | null
  /** 사용된 기술 스택 배열 */
  tech_stack: string[]
  /** 주요 프로젝트 여부 */
  featured: boolean
  /** 프로젝트 상태: 'completed' | 'in-progress' | 'archived' */
  status: 'completed' | 'in-progress' | 'archived'
  /** 프로젝트 시작일 */
  start_date: string | null
  /** 프로젝트 종료일 */
  end_date: string | null
  /** 생성일시 */
  created_at: string
  /** 수정일시 */
  updated_at: string
}

// ============================================
// Skill 타입 정의
// ============================================

export interface Skill {
  /** 기술 스택 UUID */
  id: string
  /** 기술 스택 이름 (고유값) */
  name: string
  /** 카테고리: 'frontend' | 'backend' | 'database' | 'tool' | 'language' */
  category: 'frontend' | 'backend' | 'database' | 'tool' | 'language' | string
  /** 아이콘 이미지 URL */
  icon_url: string | null
  /** 생성일시 */
  created_at: string
}

// ============================================
// 유틸리티 타입
// ============================================

/** 프로젝트 상태 타입 */
export type ProjectStatus = 'completed' | 'in-progress' | 'archived'

/** 기술 스택 카테고리 타입 */
export type SkillCategory = 'frontend' | 'backend' | 'database' | 'tool' | 'language'
