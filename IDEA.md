# Shadcn Studio - Conversation Summary

## Goal
Build a tool that helps developers create and customize a shadcn-based design system, then write the generated theme/components into their own project files.

## Direction We Converged On
- Not a traditional imported UI package.
- Not a Storybook addon.
- A local **devDependency studio app** with its own renderer (similar product shape to Storybook/Supabase Studio, but standalone).

## Product Shape
- Install in an existing React project.
- Run a local Studio UI.
- Read project config + filesystem.
- Edit tokens/components visually.
- Show file diffs.
- Write changes to real files only on explicit apply.

## Distribution Options Discussed
- Prefer npm package distribution as the primary path.
- Expose a CLI binary mainly for setup and running Studio.
- Recommended init entrypoint for existing projects:
  - `npx shadcn-studio@latest init`
- Also support equivalents:
  - `npm exec shadcn-studio@latest init`
  - `bunx shadcn-studio@latest init`
- GitHub direct execution is possible but less ideal than npm for reliability/versioning.

## Init UX Requirements (Requested)
CLI should prompt for at least:
- Run script name (default: `studio-dev`)
- shadcn `/ui` path (default: `components/ui`, likely `src/components/ui` in many projects)
- `components.json` path (default: `components.json`)

Additional useful prompts proposed:
- Studio config path (default: `shadcn-studio.config.ts`)
- Styles/tokens target file (default: `src/styles.css`)
- Port for Studio
- Conflict strategy (`ask` / `skip` / `overwrite`)

## Maintenance Risk Notes
- Moderate complexity if scope is focused (tokens + limited component set).
- High complexity if supporting many frameworks + advanced merges/refactors.
- Main long-term maintenance cost is file generation/merge safety, not the renderer UI.

## Guardrails
- No writes during install.
- No automatic silent overwrites.
- Apply changes only on explicit user action.
- Keep output idempotent.
- Always present diff before writing.

## Practical MVP
1. Init in existing React repo.
2. Launch local Studio renderer.
3. Edit theme tokens.
4. Preview changes.
5. Diff + apply to target files.
