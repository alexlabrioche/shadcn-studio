import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  DEFAULT_MAIN_THEME,
  getMainThemeComponentTsx,
  getMainThemeCss,
  loadMainTheme,
  saveMainTheme,
} from '@/features/theme-builder/model/theme'
import type {
  CssExportColorFormat,
  MainTheme,
} from '@/features/theme-builder/model/theme'
import { ExportComponentDialog } from '@/features/theme-builder/ui/export-component-dialog'
import { ExportCssDialog } from '@/features/theme-builder/ui/export-css-dialog'
import { ThemeBuilderSidebar } from '@/features/theme-builder/ui/theme-builder-sidebar'
import { ThemeDesignerPanel } from '@/features/theme-builder/ui/theme-designer-panel'
import { ThemePreview } from '@/features/theme-builder/ui/theme-preview'

export type ThemeBuilderView = 'mvp-preview' | 'theme-designer'

interface ThemeBuilderScreenProps {
  activeView: ThemeBuilderView
}

function getViewTitle(activeView: ThemeBuilderView): string {
  return activeView === 'mvp-preview' ? 'MVP Preview' : 'Theme Designer'
}

function getViewSubtitle(activeView: ThemeBuilderView): string {
  return activeView === 'mvp-preview'
    ? 'Preview your current component styling'
    : 'Edit semantic color pairs and variants'
}

export function ThemeBuilderScreen({ activeView }: ThemeBuilderScreenProps) {
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
  const exportComponentTsx = React.useMemo(
    () => getMainThemeComponentTsx(theme),
    [theme],
  )

  return (
    <SidebarProvider className="h-dvh min-h-dvh overflow-hidden">
      <ThemeBuilderSidebar activeView={activeView} />
      <SidebarInset className="min-h-0 overflow-hidden">
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/75 sticky top-0 z-20 flex min-h-14 flex-wrap items-center gap-2 border-b px-3 backdrop-blur md:px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-4" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {getViewTitle(activeView)}
            </p>
            <p className="text-muted-foreground truncate text-xs">
              {getViewSubtitle(activeView)}
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setTheme(DEFAULT_MAIN_THEME)}
          >
            Reset
          </Button>
          <ExportCssDialog
            exportCss={exportCss}
            exportColorFormat={exportColorFormat}
            onExportColorFormatChange={setExportColorFormat}
          />
          <ExportComponentDialog exportComponentTsx={exportComponentTsx} />
        </header>

        <div className="bg-linear-to-b from-zinc-100 via-white to-zinc-50 flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-none p-4 md:p-6">
          {activeView === 'mvp-preview' ? (
            <div className="mx-auto w-full max-w-5xl">
              <ThemePreview theme={theme} />
            </div>
          ) : (
            <div className="mx-auto w-full max-w-5xl">
              <ThemeDesignerPanel
                theme={theme}
                onThemeChange={(updater) =>
                  setTheme((previous) => updater(previous))
                }
              />
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
