import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getThemeColorPair } from '@/features/theme-builder/model/theme'
import type { MainTheme } from '@/features/theme-builder/model/theme'

interface ThemePreviewProps {
  theme: MainTheme
}

export function ThemePreview({ theme }: ThemePreviewProps) {
  const backgroundPair = getThemeColorPair(theme, 'background')
  const primaryPair = getThemeColorPair(theme, 'primary')

  const previewStyle = {
    '--background': backgroundPair?.color ?? '#ffffff',
    '--foreground': backgroundPair?.foreground ?? '#111827',
    '--primary': primaryPair?.color ?? '#111827',
    '--primary-foreground': primaryPair?.foreground ?? '#f9fafb',
    '--border': backgroundPair?.foreground ?? '#111827',
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
