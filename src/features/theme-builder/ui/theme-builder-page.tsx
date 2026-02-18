import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DEFAULT_MAIN_THEME,
  getMainThemeComponentTsx,
  getMainThemeCss,
  loadMainTheme,
  saveMainTheme,
} from '@/features/theme-builder/model/theme'
import type { CssExportColorFormat, MainTheme } from '@/features/theme-builder/model/theme'
import { ColorField } from '@/features/theme-builder/ui/color-field'
import { ExportComponentDialog } from '@/features/theme-builder/ui/export-component-dialog'
import { ExportCssDialog } from '@/features/theme-builder/ui/export-css-dialog'
import { ThemePreview } from '@/features/theme-builder/ui/theme-preview'

export function ThemeBuilderPage() {
  const [theme, setTheme] = React.useState<MainTheme>(() => loadMainTheme())
  const [exportColorFormat, setExportColorFormat] =
    React.useState<CssExportColorFormat>('oklch')

  React.useEffect(() => {
    saveMainTheme(theme)
  }, [theme])

  const exportCss = React.useMemo(
    () => getMainThemeCss(theme, exportColorFormat),
    [exportColorFormat, theme],
  )
  const exportComponentTsx = React.useMemo(() => getMainThemeComponentTsx(), [])

  return (
    <main className="min-h-screen bg-linear-to-b from-zinc-100 via-white to-zinc-50 p-6">
      <div className="mx-auto grid w-full max-w-6xl gap-4 lg:grid-cols-[1fr_360px]">
        <ThemePreview theme={theme} />

        <Card>
          <CardHeader>
            <CardTitle>Main Theme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ColorField
              label="background"
              value={theme.background}
              pickerFallbackHex="#ffffff"
              onChange={(value) =>
                setTheme((previous) => ({ ...previous, background: value }))
              }
            />
            <ColorField
              label="foreground"
              value={theme.foreground}
              pickerFallbackHex="#111827"
              onChange={(value) =>
                setTheme((previous) => ({ ...previous, foreground: value }))
              }
            />
            <ColorField
              label="primary"
              value={theme.primary}
              pickerFallbackHex="#111827"
              onChange={(value) =>
                setTheme((previous) => ({ ...previous, primary: value }))
              }
            />
            <ColorField
              label="primary-foreground"
              value={theme.primaryForeground}
              pickerFallbackHex="#f9fafb"
              onChange={(value) =>
                setTheme((previous) => ({
                  ...previous,
                  primaryForeground: value,
                }))
              }
            />
          </CardContent>
          <CardFooter>
            <div className="flex w-full flex-wrap items-center justify-between gap-2">
              <Button
                variant="secondary"
                onClick={() => setTheme(DEFAULT_MAIN_THEME)}
              >
                Reset
              </Button>

              <div className="flex items-center gap-2">
                <ExportCssDialog
                  exportCss={exportCss}
                  exportColorFormat={exportColorFormat}
                  onExportColorFormatChange={setExportColorFormat}
                />
                <ExportComponentDialog exportComponentTsx={exportComponentTsx} />
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
