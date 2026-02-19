/// <reference types="node" />

import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

import { loadStudioConfig } from '@/cli/config'
import { runInitCommand } from '@/cli/init'
import type { InitPrompter } from '@/cli/init'

const tempDirs: string[] = []

function createSilentConsole() {
  return {
    log: () => {},
    error: () => {},
  }
}

function createScriptedPrompter(answers: string[]): InitPrompter {
  return {
    async prompt(_label, defaultValue) {
      const next = answers.shift()
      if (next === undefined) {
        return defaultValue
      }
      const trimmed = next.trim()
      return trimmed.length > 0 ? trimmed : defaultValue
    },
    async confirm(_label, defaultValue) {
      const next = answers.shift()
      if (next === undefined || next.trim().length === 0) {
        return defaultValue
      }
      return ['y', 'yes'].includes(next.trim().toLowerCase())
    },
    close() {},
  }
}

async function createProjectDir(): Promise<string> {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'studio-init-'))
  tempDirs.push(directory)
  await writeFile(
    path.join(directory, 'package.json'),
    JSON.stringify(
      {
        name: 'fixture',
        version: '0.0.0',
        scripts: {},
      },
      null,
      2,
    ),
  )
  return directory
}

afterEach(async () => {
  await Promise.all(
    tempDirs.splice(0).map(async (directory) => {
      await rm(directory, { recursive: true, force: true })
    }),
  )
})

describe('runInitCommand', () => {
  it('accepts defaults and creates config + script wiring', async () => {
    const projectRoot = await createProjectDir()
    const result = await runInitCommand({
      projectRoot,
      out: createSilentConsole(),
      prompter: createScriptedPrompter(['', '', '', '', '', '', '']),
    })

    expect(result.ok).toBe(true)
    const loaded = await loadStudioConfig({ projectRoot })
    expect(loaded.config.scriptName).toBe('studio-dev')
    expect(loaded.config.uiPath).toBe('src/components/ui')
    expect(loaded.config.conflictStrategy).toBe('ask')

    const packageJsonRaw = await readFile(path.join(projectRoot, 'package.json'), 'utf8')
    const packageJson = JSON.parse(packageJsonRaw) as {
      scripts: Record<string, string>
    }
    expect(packageJson.scripts['studio-dev']).toBe('shadcn-studio dev')
  })

  it('retries invalid answers until valid values are provided', async () => {
    const projectRoot = await createProjectDir()
    const result = await runInitCommand({
      projectRoot,
      out: createSilentConsole(),
      prompter: createScriptedPrompter([
        'bad script name',
        'studio-dev',
        '',
        '',
        '',
        '',
        'not-a-port',
        '3030',
        'maybe',
        'skip',
      ]),
    })

    expect(result.ok).toBe(true)
    const loaded = await loadStudioConfig({ projectRoot })
    expect(loaded.config.port).toBe(3030)
    expect(loaded.config.conflictStrategy).toBe('skip')
  })
})
