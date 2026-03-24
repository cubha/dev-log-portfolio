'use client'

import { useTheme } from 'next-themes'
import Giscus from '@giscus/react'

export const GiscusComments = () => {
  const { resolvedTheme } = useTheme()

  return (
    <section className="mt-12 pt-8 border-t border-foreground/10">
      <Giscus
        id="comments"
        repo={(process.env.NEXT_PUBLIC_GISCUS_REPO ?? '') as `${string}/${string}`}
        repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? ''}
        category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? ''}
        categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? ''}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        lang="ko"
        loading="lazy"
      />
    </section>
  )
}
