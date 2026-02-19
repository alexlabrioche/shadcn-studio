/// <reference types="node" />

import path from 'node:path'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

import { loadStudioConfig } from '@/cli/config'
import { runDevCommand } from '@/cli/dev'
import {
  applyThemePatchSet,
  buildThemePatchSet,
  loadThemeFromFile,
} from '@/cli/diff-apply'
import { runInitCommand } from '@/cli/init'
import { DEFAULT_STUDIO_CONFIG } from '@/cli/types'
import type { ConflictStrategy } from '@/cli/types'

interface ParsedArgs {
  command: string
  options: Record<string, string>
}

function parseArgs(argv: string[]): ParsedArgs {
  const [command = 'help', ...rest] = argv
  const options: Record<string, string> = {}

  let index = 0
  while (index < rest.length) {
    const token = rest[index]
    if (!token.startsWith('--')) {
      index += 1
      continue
    }

    const key = token.slice(2)
    const next = rest[index + 1]
    if (!next || next.startsWith('--')) {
      options[key] = 'true'
      index += 1
      continue
    }

    options[key] = next
    index += 2
  }

  return { command, options }
}

function printHelp() {
  console.log(`shadcn-studio

Usage:
  shadcn-studio init [--config <path>]
  shadcn-studio dev [--config <path>]
  shadcn-studio diff --theme-file <path> [--config <path>] [--color-format oklch|hex]
  shadcn-studio apply --theme-file <path> [--config <path>] [--color-format oklch|hex] [--conflict-strategy ask|skip|overwrite]
`)
}

async function handleDiff(options: Record<string, string>): Promise<number> {
  const projectRoot = process.cwd()
  const themeFilePath = options['theme-file']
  if (!themeFilePath) {
    console.error('Missing required option: --theme-file <path>')
    return 1
  }

  const colorFormat = options['color-format'] === 'hex' ? 'hex' : 'oklch'
  const { config } = await loadStudioConfig({
    projectRoot,
    configPath: options.config,
  })
  const theme = await loadThemeFromFile({ projectRoot, themeFilePath })
  const patches = await buildThemePatchSet({
    projectRoot,
    config,
    theme,
    colorFormat,
  })
  const changed = patches.filter((patch) => patch.hasChanges)

  if (changed.length === 0) {
    console.log('No file changes detected.')
    return 0
  }

  console.log(`Detected ${changed.length} changed file(s):`)
  for (const patch of changed) {
    console.log(`\n# ${patch.targetPath}\n${patch.diff}`)
  }

  return 0
}

async function handleApply(options: Record<string, string>): Promise<number> {
  const projectRoot = process.cwd()
  const themeFilePath = options['theme-file']
  if (!themeFilePath) {
    console.error('Missing required option: --theme-file <path>')
    return 1
  }

  const colorFormat = options['color-format'] === 'hex' ? 'hex' : 'oklch'
  const { config } = await loadStudioConfig({
    projectRoot,
    configPath: options.config,
  })

  const conflictStrategy =
    (options['conflict-strategy'] as ConflictStrategy | undefined) ??
    config.conflictStrategy

  const theme = await loadThemeFromFile({ projectRoot, themeFilePath })
  const patches = await buildThemePatchSet({
    projectRoot,
    config,
    theme,
    colorFormat,
  })
  const changed = patches.filter((patch) => patch.hasChanges)

  if (changed.length === 0) {
    console.log('No file changes to apply.')
    return 0
  }

  console.log(`About to apply ${changed.length} changed file(s):`)
  for (const patch of changed) {
    console.log(`- ${patch.targetPath}`)
  }

  const rl = createInterface({ input: stdin, output: stdout })
  const confirmation = await rl.question('Apply these changes? (y/N): ')
  const accepted = ['y', 'yes'].includes(confirmation.trim().toLowerCase())
  if (!accepted) {
    rl.close()
    console.log('Apply canceled.')
    return 1
  }

  const results = await applyThemePatchSet({
    projectRoot,
    patches: changed,
    conflictStrategy,
    resolveConflict: async (patch) => {
      const answer = await rl.question(
        `Conflict in ${patch.targetPath}. Overwrite? (y/N): `,
      )
      return ['y', 'yes'].includes(answer.trim().toLowerCase())
        ? 'overwrite'
        : 'skip'
    },
  })
  rl.close()

  let hasError = false
  for (const result of results) {
    if (result.status === 'error') {
      hasError = true
    }
    const suffix = result.reason ? ` (${result.reason})` : ''
    console.log(`- ${result.targetPath}: ${result.status}${suffix}`)
  }

  return hasError ? 1 : 0
}

export async function runStudioCli(argv: string[]): Promise<number> {
  const { command, options } = parseArgs(argv)

  if (command === 'help' || command === '--help' || command === '-h') {
    printHelp()
    return 0
  }

  if (command === 'init') {
    const result = await runInitCommand({
      projectRoot: process.cwd(),
      configPathArg: options.config,
    })
    return result.ok ? 0 : 1
  }

  if (command === 'dev') {
    const result = await runDevCommand({
      projectRoot: process.cwd(),
      configPathArg: options.config,
    })
    return result.code
  }

  if (command === 'diff') {
    return handleDiff(options)
  }

  if (command === 'apply') {
    return handleApply(options)
  }

  console.error(`Unknown command: ${command}`)
  printHelp()
  return 1
}

async function main() {
  try {
    const code = await runStudioCli(process.argv.slice(2))
    process.exitCode = code
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}

if (import.meta.main) {
  void main()
}

export const STUDIO_THEME_FILE_DEFAULT = path.join(
  '.shadcn-studio',
  'theme.pending.json',
)
export const STUDIO_CONFIG_DEFAULT = DEFAULT_STUDIO_CONFIG.configPath
