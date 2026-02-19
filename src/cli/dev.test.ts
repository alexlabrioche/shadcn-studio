/// <reference types="node" />

import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { writeStudioConfig } from '@/cli/config'
import { runDevCommand } from '@/cli/dev'
import { DEFAULT_STUDIO_CONFIG } from '@/cli/types'

const tempDirs: string[] = []

function createSilentConsole() {
  return {
    log: () => {},
    error: () => {},
  }
}

async function createProjectDir(): Promise<string> {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'studio-dev-'))
  tempDirs.push(directory)
  await writeFile(
    path.join(directory, 'package.json'),
    JSON.stringify({ name: 'fixture', scripts: {} }, null, 2),
    'utf8',
  )
  return directory
}

afterEach(async () => {
  await Promise.all(
    tempDirs.splice(0).map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  )
})

describe('runDevCommand', () => {
  it('starts runtime when config and required paths are valid', async () => {
    const projectRoot = await createProjectDir()
    await mkdir(path.join(projectRoot, 'src/components/ui'), { recursive: true })
    await writeFile(path.join(projectRoot, 'components.json'), '{}', 'utf8')
    await writeFile(path.join(projectRoot, 'src/styles.css'), '/* css */', 'utf8')

    await writeStudioConfig({
      projectRoot,
      config: {
        ...DEFAULT_STUDIO_CONFIG,
      },
    })

    const startDevServer = vi.fn(async () => ({
      url: 'http://localhost:3011/theme-builder',
    }))

    const result = await runDevCommand({
      projectRoot,
      out: createSilentConsole(),
      startDevServer,
      waitForExit: false,
    })

    expect(result.ok).toBe(true)
    expect(result.url).toBe('http://localhost:3011/theme-builder')
    expect(startDevServer).toHaveBeenCalledOnce()
  })

  it('blocks runtime startup when required project paths are missing', async () => {
    const projectRoot = await createProjectDir()
    await writeStudioConfig({
      projectRoot,
      config: {
        ...DEFAULT_STUDIO_CONFIG,
      },
    })

    const startDevServer = vi.fn()
    const result = await runDevCommand({
      projectRoot,
      out: createSilentConsole(),
      startDevServer,
      waitForExit: false,
    })

    expect(result.ok).toBe(false)
    expect(result.code).toBe(1)
    expect(startDevServer).not.toHaveBeenCalled()
  })
})
