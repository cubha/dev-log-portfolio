import { readdir, readFile } from 'node:fs/promises'
import type { Dirent } from 'node:fs'
import { join } from 'node:path'
import { visit } from 'unist-util-visit'
import { codeToHast } from 'shiki'
import type { Root, Element } from 'hast'

/** content/projects 기준 경로 (프로젝트 루트 relative) */
const CONTENT_DIR = join(process.cwd(), 'content', 'projects')

/** RSC MDXRemote용 콘텐츠 타입 */
export type MdxContentWithRaw = { raw: string }

/**
 * pre > code 블록을 shiki로 하이라이트하는 rehype 플러그인
 */
export function rehypeShiki() {
  return async (tree: Root) => {
    const nodesToPatch: Array<{ node: Element; index: number; parent: Element | Root }> = []

    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'pre' || !parent || index === undefined) return
      if (parent.type !== 'element' && parent.type !== 'root') return
      const codeChild = node.children?.find(
        (c): c is Element => c.type === 'element' && c.tagName === 'code'
      )
      if (!codeChild) return

      nodesToPatch.push({ node, index, parent })
    })

    for (const { node, index, parent } of nodesToPatch) {
      const codeChild = node.children?.find(
        (c): c is Element => c.type === 'element' && c.tagName === 'code'
      )
      if (!codeChild) continue

      const textContent =
        codeChild.children
          ?.filter((c) => c.type === 'text')
          .map((c) => 'value' in c ? c.value : '')
          .join('') ?? ''
      const lang =
        (typeof codeChild.properties?.className === 'string'
          ? codeChild.properties.className
          : Array.isArray(codeChild.properties?.className)
            ? codeChild.properties.className.find((c): c is string => typeof c === 'string')
            : undefined
        )?.replace(/^language-/, '') ?? 'text'

      try {
        const hast = await codeToHast(textContent, {
          lang,
          theme: 'github-dark',
          transformers: [],
        })
        const newPre = hast.children?.[0]
        if (newPre && newPre.type === 'element') {
          ;(parent as Element).children[index] = newPre
        }
      } catch {
        // 하이라이트 실패 시 원본 유지
      }
    }
  }
}

/**
 * slug에 해당하는 MDX raw 문자열 반환. (RSC MDXRemote용)
 * 파일이 없으면 null.
 */
export async function getRawMdxContent(slug: string): Promise<string | null> {
  const filePath = join(CONTENT_DIR, `${slug}.mdx`)
  try {
    return await readFile(filePath, 'utf-8')
  } catch {
    return null
  }
}

/**
 * slug에 해당하는 MDX 파일을 읽어 raw 문자열로 반환.
 * 파일이 없으면 null (에러 throw 금지)
 */
export async function getMdxContent(
  slug: string
): Promise<MdxContentWithRaw | null> {
  const raw = await getRawMdxContent(slug)
  if (!raw) return null
  return { raw }
}

/**
 * content/projects/ 내 모든 .mdx 파일 slug 목록 반환
 */
export async function getAllMdxSlugs(): Promise<string[]> {
  let entries: Dirent[]
  try {
    entries = await readdir(CONTENT_DIR, { withFileTypes: true })
  } catch {
    return []
  }

  return entries
    .filter((e) => e.isFile() && e.name.endsWith('.mdx'))
    .map((e) => e.name.replace(/\.mdx$/, ''))
}
