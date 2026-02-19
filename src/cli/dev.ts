/// <reference types="node" />

import { access } from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'

import { loadStudioConfig, validateRuntimePaths } from '@/cli/config'

export interface DevServerHandle {
  url: string
  waitForExit?: () => Promise<number>
}

export type StartDevServer = (options: {
  projectRoot: string
  port: number
  configPath: string
}) => Promise<DevServerHandle>

export interface RunDevCommandOptions {
  projectRoot: string
  configPathArg?: string
  startDevServer?: StartDevServer
  out?: Pick<typeof console, 'log' | 'error'>
  waitForExit?: boolean
}

export interface RunDevCommandResult {
  ok: boolean
  code: number
  url?: string
}

async function defaultStartDevServer(options: {
  projectRoot: string
  port: number
  configPath: string
}): Promise<DevServerHandle> {
  const viteCliPath = path.resolve(
    options.projectRoot,
    'node_modules/vite/bin/vite.js',
  )
  await access(viteCliPath)

  const child = spawn(
    process.execPath,
    [viteCliPath, 'dev', '--port', String(options.port)],
    {
      cwd: options.projectRoot,
      stdio: 'inherit',
      env: {
        ...process.env,
        SHADCN_STUDIO_CONFIG: options.configPath,
      },
    },
  )

  const waitForExit = () =>
    new Promise<number>((resolve) => {
      child.once('exit', (code) => resolve(code ?? 0))
    })

  return {
    url: `http://localhost:${options.port}/theme-builder`,
    waitForExit,
  }
}

export async function runDevCommand(
  options: RunDevCommandOptions,
): Promise<RunDevCommandResult> {
  const out = options.out ?? console
  const startDevServer = options.startDevServer ?? defaultStartDevServer
  const shouldWait = options.waitForExit ?? true

  try {
    const { config, absoluteConfigPath } = await loadStudioConfig({
      projectRoot: options.projectRoot,
      configPath: options.configPathArg,
    })

    out.log(`Loaded studio config: ${path.relative(options.projectRoot, absoluteConfigPath)}`)
    out.log(`- uiPath: ${config.uiPath}`)
    out.log(`- componentsPath: ${config.componentsPath}`)
    out.log(`- stylesPath: ${config.stylesPath}`)
    out.log(`- port: ${config.port}`)

    const runtimeChecks = await validateRuntimePaths(options.projectRoot, config)
    const missing = runtimeChecks.filter((entry) => !entry.exists)
    if (missing.length > 0) {
      out.error('Studio startup blocked: required project paths are missing.')
      for (const entry of missing) {
        out.error(`- ${entry.key} (${entry.expectedKind}): ${entry.absolutePath}`)
      }
      out.error('Run "shadcn-studio init" to fix configuration values.')
      return {
        ok: false,
        code: 1,
      }
    }

    const handle = await startDevServer({
      projectRoot: options.projectRoot,
      port: config.port,
      configPath: absoluteConfigPath,
    })

    out.log(`Studio runtime ready at ${handle.url}`)

    if (!shouldWait || !handle.waitForExit) {
      return {
        ok: true,
        code: 0,
        url: handle.url,
      }
    }

    const exitCode = await handle.waitForExit()
    return {
      ok: exitCode === 0,
      code: exitCode,
      url: handle.url,
    }
  } catch (error) {
    out.error(error instanceof Error ? error.message : String(error))
    return {
      ok: false,
      code: 1,
    }
  }
}
