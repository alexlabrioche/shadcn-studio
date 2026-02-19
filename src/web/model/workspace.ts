import { parseMainTheme } from '@/shared/theme'
import type { MainTheme } from '@/shared/theme'

export interface ThemeWorkspace {
  appliedTheme: MainTheme
  draftTheme: MainTheme
}

function cloneTheme(theme: MainTheme): MainTheme {
  const cloned = parseMainTheme(JSON.stringify(theme))
  if (!cloned) {
    throw new Error('Failed to clone theme workspace state.')
  }
  return cloned
}

export function createThemeWorkspace(theme: MainTheme): ThemeWorkspace {
  return {
    appliedTheme: cloneTheme(theme),
    draftTheme: cloneTheme(theme),
  }
}

export function updateThemeWorkspaceDraft(
  workspace: ThemeWorkspace,
  updater: (theme: MainTheme) => MainTheme,
): ThemeWorkspace {
  return {
    ...workspace,
    draftTheme: cloneTheme(updater(cloneTheme(workspace.draftTheme))),
  }
}

export function resetThemeWorkspaceDraft(
  workspace: ThemeWorkspace,
): ThemeWorkspace {
  return {
    ...workspace,
    draftTheme: cloneTheme(workspace.appliedTheme),
  }
}

export function applyThemeWorkspace(workspace: ThemeWorkspace): ThemeWorkspace {
  const nextApplied = cloneTheme(workspace.draftTheme)
  return {
    appliedTheme: nextApplied,
    draftTheme: cloneTheme(nextApplied),
  }
}

export function hasPendingThemeWorkspaceChanges(
  workspace: ThemeWorkspace,
): boolean {
  return JSON.stringify(workspace.appliedTheme) !== JSON.stringify(workspace.draftTheme)
}
