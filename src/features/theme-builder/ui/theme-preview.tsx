import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { MainTheme } from '@/features/theme-builder/model/theme'

interface ThemePreviewProps {
  theme: MainTheme
}

export function ThemePreview({ theme }: ThemePreviewProps) {
  const previewStyle = {
    '--background': theme.background,
    '--foreground': theme.foreground,
    '--primary': theme.primary,
    '--primary-foreground': theme.primaryForeground,
    '--border': theme.foreground,
  } as React.CSSProperties

  return (
    <Card
      data-ds="preview"
      style={previewStyle}
      className="border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
    >
      <CardHeader>
        <CardTitle>MVP Preview</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-[260px] items-center justify-center">
        <Button>Primary Action</Button>
      </CardContent>
    </Card>
  )
}
