/// <reference types="node" />

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('package install safety', () => {
  it('has no install lifecycle scripts that can mutate project files', async () => {
    const packageJsonRaw = await readFile(
      path.resolve(process.cwd(), 'package.json'),
      'utf8',
    )
    const packageJson = JSON.parse(packageJsonRaw) as {
      scripts?: Record<string, string>
    }

    const scripts = packageJson.scripts ?? {}
    expect(scripts.preinstall).toBeUndefined()
    expect(scripts.install).toBeUndefined()
    expect(scripts.postinstall).toBeUndefined()
  })
})
