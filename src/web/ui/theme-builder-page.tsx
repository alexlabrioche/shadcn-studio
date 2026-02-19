import * as React from 'react'

import { Badge } from '@/web/ui/primitives/badge'
import { Button } from '@/web/ui/primitives/button'
import { Separator } from '@/web/ui/primitives/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/web/ui/primitives/sidebar'
import {
  createDefaultMainTheme,
  getMainThemeComponentTsx,
  getMainThemeCss,
  loadMainTheme,
  saveMainTheme,
} from '@/shared/theme'
import type { AppAppearance, CssExportColorFormat } from '@/shared/theme'
import { buildThemePreviewPatches } from '@/web/model/patch'
import {
  applyThemeWorkspace,
  createThemeWorkspace,
  hasPendingThemeWorkspaceChanges,
  resetThemeWorkspaceDraft,
  updateThemeWorkspaceDraft,
} from '@/web/model/workspace'
import { ExportComponentDialog } from '@/web/ui/export-component-dialog'
import { ExportCssDialog } from '@/web/ui/export-css-dialog'
import { ThemeChangeReviewDialog } from '@/web/ui/theme-change-review-dialog'
import { ThemeBuilderSidebar } from '@/web/ui/theme-builder-sidebar'
import { ThemeDesignerPanel } from '@/web/ui/theme-designer-panel'
import { ThemePreview } from '@/web/ui/theme-preview'

const APP_APPEARANCE_STORAGE_KEY = 'shadcn-studio.app-appearance.v1'

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
  const [workspace, setWorkspace] = React.useState(() =>
    createThemeWorkspace(loadMainTheme()),
  )
  const [appAppearance, setAppAppearance] = React.useState<AppAppearance>(() =>
    loadAppAppearance(),
  )
  const [exportColorFormat, setExportColorFormat] =
    React.useState<CssExportColorFormat>('oklch')
  const [applyReport, setApplyReport] = React.useState<
    Array<{ targetPath: string; status: 'applied' | 'unchanged' }>
  >([])

  React.useEffect(() => {
    saveAppAppearance(appAppearance)
    document.documentElement.classList.toggle('dark', appAppearance === 'dark')
  }, [appAppearance])

  const hasPendingChanges = React.useMemo(
    () => hasPendingThemeWorkspaceChanges(workspace),
    [workspace],
  )
  const previewPatches = React.useMemo(
    () =>
      buildThemePreviewPatches({
        appliedTheme: workspace.appliedTheme,
        draftTheme: workspace.draftTheme,
        colorFormat: exportColorFormat,
      }),
    [exportColorFormat, workspace],
  )
  const exportCss = React.useMemo(
    () => getMainThemeCss(workspace.draftTheme, exportColorFormat),
    [exportColorFormat, workspace.draftTheme],
  )
  const exportComponentTsx = React.useMemo(
    () => getMainThemeComponentTsx(workspace.draftTheme),
    [workspace.draftTheme],
  )

  const applyDraftChanges = React.useCallback(() => {
    const changedPatches = previewPatches.filter((patch) => patch.hasChanges)
    setWorkspace((previous) => {
      const next = applyThemeWorkspace(previous)
      saveMainTheme(next.appliedTheme)
      return next
    })
    setApplyReport(
      changedPatches.map((patch) => ({
        targetPath: patch.targetPath,
        status: 'applied',
      })),
    )
  }, [previewPatches])

  return (
    <SidebarProvider className="h-dvh min-h-dvh overflow-hidden">
      <ThemeBuilderSidebar
        appAppearance={appAppearance}
        onAppAppearanceChange={setAppAppearance}
      />
      <SidebarInset className="min-h-0 overflow-hidden">
        <header className="bg-accent sticky top-0 z-20 flex min-h-14 flex-wrap items-center gap-2 border-b px-3 backdrop-blur md:px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-4" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Theme Builder</p>
            <p className="text-muted-foreground truncate text-xs">
              Customize tokens while previewing your component
            </p>
          </div>
          <Badge variant={hasPendingChanges ? 'destructive' : 'secondary'}>
            {hasPendingChanges ? 'Unapplied changes' : 'Workspace synced'}
          </Badge>
          <Button
            variant="outline"
            onClick={() =>
              setWorkspace((previous) =>
                updateThemeWorkspaceDraft(previous, () =>
                  createDefaultMainTheme(),
                ),
              )
            }
          >
            Reset Draft
          </Button>
          <Button
            variant="outline"
            disabled={!hasPendingChanges}
            onClick={() => setWorkspace(resetThemeWorkspaceDraft)}
          >
            Discard Draft
          </Button>
          <Button disabled={!hasPendingChanges} onClick={applyDraftChanges}>
            Apply Draft
          </Button>
          <ThemeChangeReviewDialog
            patches={previewPatches}
            applyReport={applyReport}
          />
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
                theme={workspace.draftTheme}
                onThemeChange={(updater) =>
                  setWorkspace((previous) =>
                    updateThemeWorkspaceDraft(previous, updater),
                  )
                }
              />
            </div>
            <div className="bg-background min-h-0 overflow-y-auto overscroll-none">
              <ThemePreview theme={workspace.draftTheme} mode={appAppearance} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
