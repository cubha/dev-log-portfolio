import { atom } from 'jotai'
import type { BlogPost } from '@/src/types/blog'

export const editingBlogAtom = atom<BlogPost | null>(null)
export const blogFilterAtom = atom<string>('전체')
export const blogSearchAtom = atom<string>('')
