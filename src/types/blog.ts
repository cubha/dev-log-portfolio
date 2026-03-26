/**
 * 블로그 포스트(TechBlog) 관련 타입 정의
 *
 * DB 스키마: id(uuid PK), author_id(uuid FK), slug(text UNIQUE), title(text),
 *            description(text?), content(text), status(text), tags(text[]),
 *            published_at(timestamptz?), created_at(timestamptz), updated_at(timestamptz)
 *
 * 정렬 기준: published_at(내림차순)
 */

import { Database } from '@/src/types/supabase'

export type BlogPost = Database['public']['Tables']['blog_posts']['Row']
export type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert']
export type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update']

export const BLOG_STATUS = ['draft', 'published', 'archived'] as const
export type BlogStatus = (typeof BLOG_STATUS)[number]

export const STATUS_BADGE: Record<string, string> = {
  draft:     'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  published: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  archived:  'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
}

export const STATUS_LABEL: Record<string, string> = {
  draft:     '임시저장',
  published: '발행됨',
  archived:  '보관됨',
}
