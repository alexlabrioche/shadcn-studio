import { describe, expect, it } from 'vitest'

import {
  createDefaultMainTheme,
  getThemeColorPair,
  updateThemeColorPair,
} from '@/shared/theme'
import {
  applyThemeWorkspace,
  createThemeWorkspace,
  hasPendingThemeWorkspaceChanges,
  resetThemeWorkspaceDraft,
  updateThemeWorkspaceDraft,
} from '@/web/model/workspace'

describe('theme workspace', () => {
  it('tracks pending draft changes and clears them when applied', () => {
    let workspace = createThemeWorkspace(createDefaultMainTheme())
    expect(hasPendingThemeWorkspaceChanges(workspace)).toBe(false)

    workspace = updateThemeWorkspaceDraft(workspace, (previous) =>
      updateThemeColorPair(previous, 'light', 'primary', {
        color: '#123456',
      }),
    )
    expect(hasPendingThemeWorkspaceChanges(workspace)).toBe(true)

    workspace = applyThemeWorkspace(workspace)
    expect(hasPendingThemeWorkspaceChanges(workspace)).toBe(false)
    expect(getThemeColorPair(workspace.appliedTheme, 'light', 'primary')?.color).toBe(
      '#123456',
    )
  })

  it('restores draft back to the last applied state', () => {
    let workspace = createThemeWorkspace(createDefaultMainTheme())
    workspace = updateThemeWorkspaceDraft(workspace, (previous) =>
      updateThemeColorPair(previous, 'dark', 'primary', {
        color: '#654321',
      }),
    )
    expect(hasPendingThemeWorkspaceChanges(workspace)).toBe(true)

    workspace = resetThemeWorkspaceDraft(workspace)
    expect(hasPendingThemeWorkspaceChanges(workspace)).toBe(false)
  })
})
