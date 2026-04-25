import type { ReactNode, CSSProperties } from 'react'

interface PageHeaderProps {
  context: string
  title: ReactNode
  desc?: ReactNode
  aside?: ReactNode
  titleStyle?: CSSProperties
  descStyle?: CSSProperties
  marginBottom?: number
}

const px = 'clamp(20px, 5.5vw, 80px)'

export function PageHeader({
  context,
  title,
  desc,
  aside,
  titleStyle,
  descStyle,
  marginBottom = 0,
}: PageHeaderProps) {
  const hasAside = aside != null

  const titleEl = (
    <h1
      className="h-1"
      style={{
        marginTop: 0,
        marginRight: 0,
        marginBottom: desc ? 20 : 0,
        marginLeft: 0,
        lineHeight: 1.1,
        ...titleStyle,
      }}
    >
      {title}
    </h1>
  )

  const descEl = desc && (
    <p className="text-muted" style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 640, ...descStyle }}>
      {desc}
    </p>
  )

  return (
    <section style={{ padding: `72px ${px} 40px` }}>
      <div className="page-context" style={{ marginBottom: 40 }}>
        {context}
      </div>
      {hasAside ? (
        <div
          className="grid page-header-grid page-header-grid-2col-25vw"
          style={{ gap: 'clamp(40px, 5.5vw, 80px)', alignItems: desc ? 'start' : 'end', marginBottom }}
        >
          <div>
            {titleEl}
            {descEl}
          </div>
          <div className="hidden md:block md:text-right">
            {aside}
          </div>
        </div>
      ) : (
        <div style={{ marginBottom }}>
          {titleEl}
          {descEl}
        </div>
      )}
    </section>
  )
}
