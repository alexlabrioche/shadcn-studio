## Why

Teams using shadcn/ui often want deeper design system control, but setup and safe code generation are fragmented across manual edits, one-off scripts, and ad hoc conventions. A package-first studio workflow is needed now to let developers customize tokens/components visually and apply changes to real project files with predictable, reviewable behavior.

## What Changes

- Introduce an npm-distributed "supercharged shadcn studio" package that runs as a local dev tool inside existing projects.
- Add a CLI init/setup flow that configures project paths, run script name, and studio settings with sensible defaults.
- Provide a local studio UI for token/component customization and preview, backed by project config + filesystem awareness.
- Add a diff-and-apply workflow where writes happen only after explicit user confirmation.
- Add guardrails for idempotent generation and safe conflict handling (ask/skip/overwrite strategies).

## Capabilities

### New Capabilities

- `studio-cli-bootstrap`: Initialize and configure the studio in an existing project (paths, scripts, config file, conflict policy).
- `studio-local-runtime`: Launch and run a local studio app that reads project context and renders live customization previews.
- `studio-theme-token-editing`: Provide visual editing for design tokens and related style targets used by shadcn-based systems.
- `studio-diff-and-apply`: Generate file diffs and apply changes to project files only on explicit user action.
- `studio-safe-file-generation`: Enforce no-install-writes, idempotent output, and configurable conflict resolution safeguards.

### Modified Capabilities

- None.

## Impact

- Adds new artifacts under `openspec/changes/supercharged-shadcn-package/` for proposal, design, specs, and tasks.
- Introduces/extends package and CLI surfaces for local studio initialization and execution.
- Affects filesystem write pathways and requires explicit safety constraints around diffing, apply behavior, and overwrite policy.
- Establishes capability contracts for upcoming spec documents and implementation planning.
