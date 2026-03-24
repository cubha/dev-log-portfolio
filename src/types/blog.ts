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
