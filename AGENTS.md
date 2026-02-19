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
| `src/web`           | Studio web app domain UI (`ui`) and web-only model modules (`model`).   |
| `src/web/ui/primitives` | App-only primitive components used by the studio web UI.            |
| `src/components/ui` | Reserved output target for generated end-user component libraries.       |
| `src/cli`           | Node CLI/runtime logic (`init`, `dev`, `diff`, `apply`) for Studio.     |
| `src/shared`        | Runtime-agnostic shared model/utilities used by web and CLI.             |
| `src/lib`           | Shared utility modules (for example `cn` and shared helpers).            |
| `src/web/styles.css` | Web app runtime styles (Tailwind imports, tokens, global app styles).   |
| `src/styles.css`    | Reserved output target for generated end-user theme stylesheet.          |
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

- `src/web/ui/primitives/*` is app-facing primitive code for the studio web app.
- `src/components/ui/*` is treated as generated/output surface for end-user component library experiments.
- Keep app primitives and generated library outputs decoupled: web app code must not import from `src/components/ui/*`.

## Safety Rules (Agents and Humans)

- Avoid destructive commands unless explicitly requested (for example `git reset --hard`, `rm -rf`).
- Never revert unrelated working tree changes.
- Prefer minimal, reviewable diffs.
- Read affected files before editing and keep behavior changes intentional.

## Doc Sync Rule

- If implementation changes plan assumptions, scope, interfaces, or delivery phases, update `PLAN.md` in the same PR.
- If workflow or contributor rules change, update `AGENTS.md` in the same PR.
- Plan-impacting PRs should include a short note explaining what changed in the plan and why.
