import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  createDefaultMainTheme,
  getMainThemeComponentTsx,
  getMainThemeCss,
  loadMainTheme,
  saveMainTheme,
} from '@/features/theme-builder/model/theme'
import type {
  AppAppearance,
  CssExportColorFormat,
  MainTheme,
  ThemeMode,
} from '@/features/theme-builder/model/theme'
import { ExportComponentDialog } from '@/features/theme-builder/ui/export-component-dialog'
import { ExportCssDialog } from '@/features/theme-builder/ui/export-css-dialog'
import { ThemeBuilderSidebar } from '@/features/theme-builder/ui/theme-builder-sidebar'
import { ThemeDesignerPanel } from '@/features/theme-builder/ui/theme-designer-panel'
import { ThemePreview } from '@/features/theme-builder/ui/theme-preview'

const APP_APPEARANCE_STORAGE_KEY = 'giga-shad.app-appearance.v1'

function getSystemAppAppearance(): AppAppearance {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function loadAppAppearance(): AppAppearance {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const raw = window.localStorage.getItem(APP_APPEARANCE_STORAGE_KEY)
  if (raw === 'light' || raw === 'dark') {
    return raw
  }

  return getSystemAppAppearance()
}

function saveAppAppearance(appAppearance: AppAppearance) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(APP_APPEARANCE_STORAGE_KEY, appAppearance)
}

export function ThemeBuilderScreen() {
  const [theme, setTheme] = React.useState<MainTheme>(() => loadMainTheme())
  const [appAppearance, setAppAppearance] = React.useState<AppAppearance>(() =>
    loadAppAppearance(),
  )
  const [designerEditMode, setDesignerEditMode] = React.useState<ThemeMode>(
    () => loadAppAppearance(),
  )
  const [exportColorFormat, setExportColorFormat] =
    React.useState<CssExportColorFormat>('oklch')

  React.useEffect(() => {
    saveMainTheme(theme)
  }, [theme])

  React.useEffect(() => {
    saveAppAppearance(appAppearance)
    document.documentElement.classList.toggle('dark', appAppearance === 'dark')
  }, [appAppearance])

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
      <ThemeBuilderSidebar
        appAppearance={appAppearance}
        onAppAppearanceChange={setAppAppearance}
      />
      <SidebarInset className="min-h-0 overflow-hidden">
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/75 sticky top-0 z-20 flex min-h-14 flex-wrap items-center gap-2 border-b px-3 backdrop-blur md:px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-4" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Theme Builder</p>
            <p className="text-muted-foreground truncate text-xs">
              Customize tokens while previewing your component
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setTheme(createDefaultMainTheme())}
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

        <div className="bg-accent min-h-0 flex-1 overflow-hidden">
          <div className="grid h-full min-h-0 lg:grid-cols-[minmax(340px,1fr)_minmax(0,1.55fr)]">
            <div className="min-h-0 overflow-y-auto overscroll-none border-r">
              <ThemeDesignerPanel
                theme={theme}
                mode={designerEditMode}
                appAppearance={appAppearance}
                onModeChange={setDesignerEditMode}
                onAppAppearanceChange={setAppAppearance}
                onThemeChange={(updater) =>
                  setTheme((previous) => updater(previous))
                }
              />
            </div>
            <div className="bg-background min-h-0 overflow-y-auto overscroll-none">
              <ThemePreview theme={theme} mode={appAppearance} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
