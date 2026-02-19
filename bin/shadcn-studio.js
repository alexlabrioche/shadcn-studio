#!/usr/bin/env node

import('../dist/studio/cli.js')
  .then(async (module) => {
    if (typeof module.runStudioCli !== 'function') {
      throw new Error('runStudioCli export not found in dist/studio/cli.js')
    }
    const code = await module.runStudioCli(process.argv.slice(2))
    process.exitCode = code
  })
  .catch((error) => {
    const message = error instanceof Error ? error.message : String(error)
    console.error(message)
    process.exitCode = 1
  })
