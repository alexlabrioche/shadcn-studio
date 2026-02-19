/// <reference types="node" />

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import {
  addCustomThemeColorPair,
  createDefaultMainTheme,
  getMainThemeComponentTsx,
  getMainThemeCss,
  parseMainTheme,
} from '@/shared/theme'
import type {
  CssExportColorFormat,
  MainTheme,
} from '@/shared/theme'
import type {
  ConflictStrategy,
  StudioApplyResult,
  StudioConfig,
  StudioPatch,
} from '@/cli/types'

export interface BuildThemePatchSetOptions {
  projectRoot: string
  config: StudioConfig
  theme: MainTheme
  colorFormat?: CssExportColorFormat
}

export interface ApplyThemePatchSetOptions {
  projectRoot: string
  patches: StudioPatch[]
  conflictStrategy: ConflictStrategy
  resolveConflict?: (patch: StudioPatch) => Promise<'overwrite' | 'skip'>
}

export function formatFileDiff(targetPath: string, before: string, after: string): string {
  if (before === after) {
    return `--- a/${targetPath}\n+++ b/${targetPath}\n(no changes)`
  }

  const beforeLines = before.split('\n')
  const afterLines = after.split('\n')
  const diffLines = [`--- a/${targetPath}`, `+++ b/${targetPath}`, '@@']

  for (const line of beforeLines) {
    diffLines.push(`-${line}`)
  }
  for (const line of afterLines) {
    diffLines.push(`+${line}`)
  }

  return diffLines.join('\n')
}

async function safeReadFile(filePath: string): Promise<string> {
  try {
    return await readFile(filePath, 'utf8')
  } catch {
    return ''
  }
}

function getThemeOutputs(
  theme: MainTheme,
  config: StudioConfig,
  colorFormat: CssExportColorFormat,
): Array<{ targetPath: string; nextContent: string }> {
  const buttonPath = path.join(config.uiPath, 'button.tsx')
  return [
    {
      targetPath: config.stylesPath,
      nextContent: getMainThemeCss(theme, colorFormat),
    },
    {
      targetPath: buttonPath,
      nextContent: getMainThemeComponentTsx(theme),
    },
  ].sort((a, b) => a.targetPath.localeCompare(b.targetPath))
}

export async function buildThemePatchSet(
  options: BuildThemePatchSetOptions,
): Promise<StudioPatch[]> {
  const colorFormat = options.colorFormat ?? 'oklch'
  const targets = getThemeOutputs(options.theme, options.config, colorFormat)
  const patches: StudioPatch[] = []

  for (const target of targets) {
    const absolutePath = path.resolve(options.projectRoot, target.targetPath)
    const before = await safeReadFile(absolutePath)
    const after = target.nextContent
    patches.push({
      targetPath: target.targetPath,
      before,
      after,
      hasChanges: before !== after,
      diff: formatFileDiff(target.targetPath, before, after),
    })
  }

  return patches
}

export async function applyThemePatchSet(
  options: ApplyThemePatchSetOptions,
): Promise<StudioApplyResult[]> {
  const results: StudioApplyResult[] = []

  for (const patch of options.patches) {
    if (!patch.hasChanges) {
      results.push({
        targetPath: patch.targetPath,
        status: 'noop',
        reason: 'No content changes detected.',
      })
      continue
    }

    const absolutePath = path.resolve(options.projectRoot, patch.targetPath)
    const current = await safeReadFile(absolutePath)
    const hasConflict = current !== patch.before

    let shouldWrite = true
    if (hasConflict) {
      if (options.conflictStrategy === 'skip') {
        shouldWrite = false
      } else if (options.conflictStrategy === 'ask') {
        const decision = options.resolveConflict
          ? await options.resolveConflict(patch)
          : 'skip'
        shouldWrite = decision === 'overwrite'
      }
    }

    if (!shouldWrite) {
      results.push({
        targetPath: patch.targetPath,
        status: 'skipped',
        reason: 'Conflict detected; file was skipped.',
      })
      continue
    }

    try {
      await mkdir(path.dirname(absolutePath), { recursive: true })
      await writeFile(absolutePath, patch.after, 'utf8')
      results.push({
        targetPath: patch.targetPath,
        status: 'applied',
      })
    } catch (error) {
      results.push({
        targetPath: patch.targetPath,
        status: 'error',
        reason: error instanceof Error ? error.message : String(error),
      })
    }
  }

  return results
}

export async function loadThemeFromFile(options: {
  projectRoot: string
  themeFilePath: string
}): Promise<MainTheme> {
  const absolutePath = path.resolve(options.projectRoot, options.themeFilePath)
  const raw = await readFile(absolutePath, 'utf8')
  const parsed = parseMainTheme(raw)
  if (!parsed) {
    throw new Error(
      `Invalid theme JSON at ${absolutePath}. Provide a serialized MainTheme payload.`,
    )
  }
  return parsed
}

export function createDemoThemeForTests(): MainTheme {
  const withCustomPair = addCustomThemeColorPair(createDefaultMainTheme(), {
    name: 'brand',
    includeInButtonVariant: true,
  })
  return withCustomPair.theme
}
