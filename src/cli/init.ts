/// <reference types="node" />

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

import {
  normalizeStudioConfig,
  validateStudioConfig,
  writeStudioConfig,
} from '@/cli/config'
import { DEFAULT_STUDIO_CONFIG } from '@/cli/types'
import type { StudioConfig } from '@/cli/types'

export interface InitPrompter {
  prompt: (label: string, defaultValue: string) => Promise<string>
  confirm: (label: string, defaultValue: boolean) => Promise<boolean>
  close?: () => void | Promise<void>
}

export interface RunInitCommandOptions {
  projectRoot: string
  configPathArg?: string
  prompter?: InitPrompter
  out?: Pick<typeof console, 'log' | 'error'>
}

export interface RunInitCommandResult {
  ok: boolean
  config?: StudioConfig
  configFile?: string
  scriptUpdated?: boolean
}

function createConsolePrompter(): InitPrompter {
  const rl = createInterface({ input: stdin, output: stdout })

  return {
    async prompt(label, defaultValue) {
      const answer = await rl.question(`${label} [${defaultValue}]: `)
      const trimmed = answer.trim()
      return trimmed.length > 0 ? trimmed : defaultValue
    },
    async confirm(label, defaultValue) {
      const defaultLabel = defaultValue ? 'Y/n' : 'y/N'
      const answer = await rl.question(`${label} (${defaultLabel}): `)
      const normalized = answer.trim().toLowerCase()
      if (!normalized) {
        return defaultValue
      }
      return normalized === 'y' || normalized === 'yes'
    },
    close() {
      rl.close()
    },
  }
}

async function promptUntilValid(options: {
  prompter: InitPrompter
  label: string
  defaultValue: string
  validate: (value: string) => string | null
  out: Pick<typeof console, 'log' | 'error'>
}): Promise<string> {
  for (;;) {
    const value = await options.prompter.prompt(options.label, options.defaultValue)
    const issue = options.validate(value)
    if (!issue) {
      return value
    }
    options.out.error(`  ${issue}`)
  }
}

function validateSingleField(
  overrides: Partial<StudioConfig>,
  field: keyof StudioConfig,
): string | null {
  const config = normalizeStudioConfig(overrides)
  const issues = validateStudioConfig(config)
  const match = issues.find((issue) => issue.startsWith(field))
  return match ?? null
}

async function upsertPackageScript(options: {
  projectRoot: string
  scriptName: string
  command: string
  prompter: InitPrompter
  out: Pick<typeof console, 'log' | 'error'>
}): Promise<boolean> {
  const packageJsonPath = path.resolve(options.projectRoot, 'package.json')
  const packageJsonRaw = await readFile(packageJsonPath, 'utf8')
  const packageJson = JSON.parse(packageJsonRaw) as {
    scripts?: Record<string, string>
  }

  if (!packageJson.scripts || typeof packageJson.scripts !== 'object') {
    packageJson.scripts = {}
  }

  const currentValue = packageJson.scripts[options.scriptName]
  if (
    typeof currentValue === 'string' &&
    currentValue.trim() &&
    currentValue !== options.command
  ) {
    const shouldOverwrite = await options.prompter.confirm(
      `Script "${options.scriptName}" already exists. Overwrite it?`,
      false,
    )
    if (!shouldOverwrite) {
      options.out.log(
        `Skipped script update for "${options.scriptName}" (existing value kept).`,
      )
      return false
    }
  }

  packageJson.scripts[options.scriptName] = options.command
  await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8')
  return true
}

export async function runInitCommand(
  options: RunInitCommandOptions,
): Promise<RunInitCommandResult> {
  const out = options.out ?? console
  const prompter = options.prompter ?? createConsolePrompter()

  try {
    out.log('Configuring shadcn-studio for this project...')

    const scriptName = await promptUntilValid({
      prompter,
      out,
      label: 'Run script name',
      defaultValue: DEFAULT_STUDIO_CONFIG.scriptName,
      validate: (value) =>
        validateSingleField({ scriptName: value }, 'scriptName') ??
        (value === 'dev'
          ? '"dev" already exists in most projects. Choose a dedicated script name.'
          : null),
    })

    const uiPath = await promptUntilValid({
      prompter,
      out,
      label: 'shadcn /ui path',
      defaultValue: DEFAULT_STUDIO_CONFIG.uiPath,
      validate: (value) => validateSingleField({ uiPath: value }, 'uiPath'),
    })

    const componentsPath = await promptUntilValid({
      prompter,
      out,
      label: 'components.json path',
      defaultValue: DEFAULT_STUDIO_CONFIG.componentsPath,
      validate: (value) =>
        validateSingleField({ componentsPath: value }, 'componentsPath'),
    })

    const configPath = await promptUntilValid({
      prompter,
      out,
      label: 'Studio config path',
      defaultValue: options.configPathArg ?? DEFAULT_STUDIO_CONFIG.configPath,
      validate: (value) => validateSingleField({ configPath: value }, 'configPath'),
    })

    const stylesPath = await promptUntilValid({
      prompter,
      out,
      label: 'Styles/tokens target file',
      defaultValue: DEFAULT_STUDIO_CONFIG.stylesPath,
      validate: (value) => validateSingleField({ stylesPath: value }, 'stylesPath'),
    })

    const portRaw = await promptUntilValid({
      prompter,
      out,
      label: 'Studio port',
      defaultValue: String(DEFAULT_STUDIO_CONFIG.port),
      validate: (value) => {
        const parsed = Number.parseInt(value, 10)
        return validateSingleField({ port: parsed }, 'port')
      },
    })

    const conflictStrategy = await promptUntilValid({
      prompter,
      out,
      label: 'Conflict strategy (ask|skip|overwrite)',
      defaultValue: DEFAULT_STUDIO_CONFIG.conflictStrategy,
      validate: (value) =>
        validateSingleField(
          { conflictStrategy: value as StudioConfig['conflictStrategy'] },
          'conflictStrategy',
        ),
    })

    const config = normalizeStudioConfig({
      scriptName,
      uiPath,
      componentsPath,
      configPath,
      stylesPath,
      port: Number.parseInt(portRaw, 10),
      conflictStrategy: conflictStrategy as StudioConfig['conflictStrategy'],
    })

    await mkdir(options.projectRoot, { recursive: true })
    const configFile = await writeStudioConfig({
      projectRoot: options.projectRoot,
      config,
    })

    const scriptUpdated = await upsertPackageScript({
      projectRoot: options.projectRoot,
      scriptName: config.scriptName,
      command: 'shadcn-studio dev',
      prompter,
      out,
    })

    out.log(`Created ${path.relative(options.projectRoot, configFile)}.`)
    out.log(
      `You can now run "${config.scriptName}" to launch the studio runtime.`,
    )

    return {
      ok: true,
      config,
      configFile,
      scriptUpdated,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    out.error(message)
    return { ok: false }
  } finally {
    await prompter.close?.()
  }
}
