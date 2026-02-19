import {
  getMainThemeComponentTsx,
  getMainThemeCss,
} from '@/shared/theme'
import type {
  CssExportColorFormat,
  MainTheme,
} from '@/shared/theme'

export interface ThemePreviewPatch {
  targetPath: string
  before: string
  after: string
  hasChanges: boolean
  diff: string
}

function formatFileDiff(targetPath: string, before: string, after: string): string {
  if (before === after) {
    return `--- a/${targetPath}\n+++ b/${targetPath}\n(no changes)`
  }

  const diffLines = [`--- a/${targetPath}`, `+++ b/${targetPath}`, '@@']
  for (const line of before.split('\n')) {
    diffLines.push(`-${line}`)
  }
  for (const line of after.split('\n')) {
    diffLines.push(`+${line}`)
  }

  return diffLines.join('\n')
}

export function buildThemePreviewPatches(options: {
  appliedTheme: MainTheme
  draftTheme: MainTheme
  colorFormat: CssExportColorFormat
  stylesPath?: string
  buttonPath?: string
}): ThemePreviewPatch[] {
  const stylesPath = options.stylesPath ?? 'src/styles.css'
  const buttonPath = options.buttonPath ?? 'src/components/ui/button.tsx'

  const beforeTargets: Array<{ targetPath: string; content: string }> = [
    {
      targetPath: stylesPath,
      content: getMainThemeCss(options.appliedTheme, options.colorFormat),
    },
    {
      targetPath: buttonPath,
      content: getMainThemeComponentTsx(options.appliedTheme),
    },
  ]
  const afterTargets: Array<{ targetPath: string; content: string }> = [
    {
      targetPath: stylesPath,
      content: getMainThemeCss(options.draftTheme, options.colorFormat),
    },
    {
      targetPath: buttonPath,
      content: getMainThemeComponentTsx(options.draftTheme),
    },
  ]

  return beforeTargets
    .map((beforeTarget, index) => {
      const afterTarget = afterTargets[index]
      const hasChanges = beforeTarget.content !== afterTarget.content
      return {
        targetPath: beforeTarget.targetPath,
        before: beforeTarget.content,
        after: afterTarget.content,
        hasChanges,
        diff: formatFileDiff(
          beforeTarget.targetPath,
          beforeTarget.content,
          afterTarget.content,
        ),
      }
    })
    .sort((a, b) => a.targetPath.localeCompare(b.targetPath))
}
