# Giga Shad Contributor + Agent Guide

## Purpose

This document is the operational source of truth for contributors and coding agents working in this repository. Follow it for environment setup, coding rules, validation, and documentation sync.

## Environment Requirements

- Node.js: `>=22.12.0` (required baseline for Vite 7 compatibility).
- Bun: required package manager and script runner.

## Project Map

| Path                | Responsibility                                                           |
| ------------------- | ------------------------------------------------------------------------ |
| `src/routes`        | File-based route definitions and mode entry points.                      |
| `src/pages`         | Page-level UI composed by routes.                                        |
| `src/components/ui` | Shadcn-based UI primitives and variants used across the app.             |
| `src/lib`           | Shared utility modules (for example `cn` and shared helpers).            |
| `src/styles.css`    | Tailwind imports, theme tokens, and global style variables.              |
| `PLAN.md`           | Product and implementation plan, scope, phases, and acceptance criteria. |

## Runbook Commands

```bash
bun install
bun run dev
bun run lint
bun run test
bun run build
```

## Completion Criteria

- A task is not complete until `lint`, `test`, and `build` pass.
- Required release gate:
  - `bun run lint`
  - `bun run test`
  - `bun run build`
- Transitional baseline note (2026-02-18):
  - `lint` currently fails in the baseline due to at least one lint error (`src/lib/utils.ts` import type style).
  - `test` currently exits with code 1 because there are no test files yet.
  - Any implementation that touches relevant areas should improve baseline toward a green gate.

## Code Rules

- Keep TypeScript strict. Do not weaken strict compiler settings in `tsconfig.json`.
- Prefer `@/` path alias imports for project modules.
- Do not manually edit generated files, especially `src/routeTree.gen.ts`.
- Keep diffs focused: avoid broad refactors unless required by the task.
- Preserve existing architecture patterns unless the change explicitly updates `PLAN.md`.

## UI Component Policy

- `src/components/ui/*` is editable baseline project code, not frozen vendor code.
- Treat component edits as first-class product work: maintain variant contracts, token usage, and consistency.
- When changing shared primitives, validate downstream usage and route/page rendering impact.

## Safety Rules (Agents and Humans)

- Avoid destructive commands unless explicitly requested (for example `git reset --hard`, `rm -rf`).
- Never revert unrelated working tree changes.
- Prefer minimal, reviewable diffs.
- Read affected files before editing and keep behavior changes intentional.

## Doc Sync Rule

- If implementation changes plan assumptions, scope, interfaces, or delivery phases, update `PLAN.md` in the same PR.
- If workflow or contributor rules change, update `AGENTS.md` in the same PR.
- Plan-impacting PRs should include a short note explaining what changed in the plan and why.
