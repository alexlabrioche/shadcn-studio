/// <reference types="node" />

import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  createDefaultMainTheme,
  getMainThemeComponentTsx,
  getMainThemeCss,
} from '@/shared/theme'
import {
  applyThemePatchSet,
  buildThemePatchSet,
  createDemoThemeForTests,
} from '@/cli/diff-apply'
import { DEFAULT_STUDIO_CONFIG } from '@/cli/types'

const tempDirs: string[] = []

async function createProjectDir(): Promise<string> {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'studio-apply-'))
  tempDirs.push(directory)
  await mkdir(path.join(directory, 'src/components/ui'), { recursive: true })
  await writeFile(path.join(directory, 'components.json'), '{}', 'utf8')
  return directory
}

afterEach(async () => {
  await Promise.all(
    tempDirs.splice(0).map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  )
})

describe('theme patch generation and apply', () => {
  it('does not write files during patch generation', async () => {
    const projectRoot = await createProjectDir()
    const initialTheme = createDefaultMainTheme()
    await writeFile(
      path.join(projectRoot, 'src/styles.css'),
      getMainThemeCss(initialTheme),
      'utf8',
    )
    await writeFile(
      path.join(projectRoot, 'src/components/ui/button.tsx'),
      getMainThemeComponentTsx(initialTheme),
      'utf8',
    )

    await buildThemePatchSet({
      projectRoot,
      config: DEFAULT_STUDIO_CONFIG,
      theme: createDemoThemeForTests(),
    })

    const currentStyles = await readFile(path.join(projectRoot, 'src/styles.css'), 'utf8')
    expect(currentStyles).toBe(getMainThemeCss(initialTheme))
  })

  it('reports mixed apply results when one file conflicts in skip mode', async () => {
    const projectRoot = await createProjectDir()
    const initialTheme = createDefaultMainTheme()
    await writeFile(
      path.join(projectRoot, 'src/styles.css'),
      getMainThemeCss(initialTheme),
      'utf8',
    )
    await writeFile(
      path.join(projectRoot, 'src/components/ui/button.tsx'),
      getMainThemeComponentTsx(initialTheme),
      'utf8',
    )

    const patches = await buildThemePatchSet({
      projectRoot,
      config: DEFAULT_STUDIO_CONFIG,
      theme: createDemoThemeForTests(),
    })
    await writeFile(path.join(projectRoot, 'src/styles.css'), '/* conflicted */', 'utf8')

    const results = await applyThemePatchSet({
      projectRoot,
      patches,
      conflictStrategy: 'skip',
    })

    const resultByPath = new Map(results.map((result) => [result.targetPath, result]))
    expect(resultByPath.get('src/styles.css')?.status).toBe('skipped')
    expect(resultByPath.get('src/components/ui/button.tsx')?.status).toBe('applied')
  })

  it('is idempotent for repeated apply operations with the same inputs', async () => {
    const projectRoot = await createProjectDir()
    const initialTheme = createDefaultMainTheme()
    await writeFile(
      path.join(projectRoot, 'src/styles.css'),
      getMainThemeCss(initialTheme),
      'utf8',
    )
    await writeFile(
      path.join(projectRoot, 'src/components/ui/button.tsx'),
      getMainThemeComponentTsx(initialTheme),
      'utf8',
    )

    const nextTheme = createDemoThemeForTests()
    const firstPatches = await buildThemePatchSet({
      projectRoot,
      config: DEFAULT_STUDIO_CONFIG,
      theme: nextTheme,
    })
    await applyThemePatchSet({
      projectRoot,
      patches: firstPatches,
      conflictStrategy: 'overwrite',
    })

    const secondPatches = await buildThemePatchSet({
      projectRoot,
      config: DEFAULT_STUDIO_CONFIG,
      theme: nextTheme,
    })

    expect(secondPatches.every((patch) => !patch.hasChanges)).toBe(true)
  })

  it('prompts conflict resolution in ask mode', async () => {
    const projectRoot = await createProjectDir()
    const initialTheme = createDefaultMainTheme()
    await writeFile(
      path.join(projectRoot, 'src/styles.css'),
      getMainThemeCss(initialTheme),
      'utf8',
    )
    await writeFile(
      path.join(projectRoot, 'src/components/ui/button.tsx'),
      getMainThemeComponentTsx(initialTheme),
      'utf8',
    )

    const patches = await buildThemePatchSet({
      projectRoot,
      config: DEFAULT_STUDIO_CONFIG,
      theme: createDemoThemeForTests(),
    })
    await writeFile(path.join(projectRoot, 'src/styles.css'), '/* conflicted */', 'utf8')

    const resolveConflict = vi.fn(async () => 'skip' as const)
    await applyThemePatchSet({
      projectRoot,
      patches,
      conflictStrategy: 'ask',
      resolveConflict,
    })

    expect(resolveConflict).toHaveBeenCalled()
  })
})
