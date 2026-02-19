## 1. Package Foundation

- [ ] 1.1 Create package structure for the studio toolkit (CLI entrypoint, runtime entrypoint, shared config/types modules)
- [ ] 1.2 Add package scripts and build plumbing for local development and distribution
- [ ] 1.3 Define studio configuration schema and defaults (`scriptName`, `uiPath`, `componentsPath`, `configPath`, `stylesPath`, `port`, `conflictStrategy`)

## 2. CLI Bootstrap (`studio-cli-bootstrap`)

- [ ] 2.1 Implement `init` command with interactive prompts and default values
- [ ] 2.2 Implement config file generation and script wiring for successful init flows
- [ ] 2.3 Add input validation for init prompt values with blocking error messages on invalid paths/options
- [ ] 2.4 Add CLI tests for default acceptance and invalid-input retry behavior

## 3. Local Runtime (`studio-local-runtime`)

- [ ] 3.1 Implement `dev` runtime command that loads studio config and starts the local studio server
- [ ] 3.2 Surface local studio URL and startup diagnostics in terminal output
- [ ] 3.3 Implement startup validation for required project context paths and block editing when missing
- [ ] 3.4 Add runtime tests for successful startup and missing-context error handling

## 4. Token Editing + Preview (`studio-theme-token-editing`)

- [ ] 4.1 Implement token state model for pending (unapplied) edits
- [ ] 4.2 Build visual token editing controls connected to pending state updates
- [ ] 4.3 Implement live preview rendering from pending token state without mutating files
- [ ] 4.4 Add tests that confirm edits mark workspace dirty and preview updates before apply

## 5. Diff + Apply Pipeline (`studio-diff-and-apply`)

- [ ] 5.1 Implement patch/diff generation layer that groups pending changes by target file
- [ ] 5.2 Build review UI/API to present file-level diffs before apply is available
- [ ] 5.3 Implement explicit apply action that writes files only after user confirmation
- [ ] 5.4 Implement per-file apply result reporting for success/failure outcomes
- [ ] 5.5 Add integration tests covering no-write-before-apply and mixed-result apply reporting

## 6. Safety and Determinism (`studio-safe-file-generation`)

- [ ] 6.1 Ensure install lifecycle performs zero project file writes (audit/remove side-effect hooks)
- [ ] 6.2 Implement deterministic generation rules (stable ordering/serialization) for repeatable outputs
- [ ] 6.3 Implement conflict strategy handling for `ask`, `skip`, and `overwrite` modes
- [ ] 6.4 Add tests for install-time safety, idempotent repeated apply, and `ask` conflict prompting

## 7. Documentation and Release Readiness

- [ ] 7.1 Document init/dev usage and supported execution commands (`npx`, `npm exec`, `bunx`)
- [ ] 7.2 Document configuration fields, defaults, and conflict strategy behavior
- [ ] 7.3 Run and fix release gate checks (`bun run lint`, `bun run test`, `bun run build`) for touched areas
