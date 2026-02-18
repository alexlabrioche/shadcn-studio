# Giga Shad MVP Plan

## Goal
Build a single-page design-system builder that can render editable page layouts from config, support token-driven theming, and enable interaction wiring in a preview/editor loop. The MVP prioritizes usable authoring workflows over export and integrations.

## Scope
### MVP Includes (Phase 1)
- Runtime preview at `/preview/:pageId`.
- Dev editor at `/dev/:pageId` with container/tree editing and inspector.
- Design system token editor at `/design-system`.
- Interaction assignment model (`navigate`, `open`, `submit`) from preview inspector.
- Local-first persistence using browser `localStorage`.

### MVP Excludes
- Export v1 generated shadcn kit artifacts (moved to Phase 2).
- Figma plugin import/export workflows (Phase 3).
- Backend multi-user collaboration and server persistence (Phase 3+ optional).

## Architecture
### App Structure
- Single SPA with Vite + React + TypeScript + TanStack Router.
- Shared runtime renderer for preview and dev modes.
- Container-driven layout model (nesting and ordering), no absolute-position canvas editor.

### Route-Level Modes
- `/preview/:pageId`: runtime preview with clickable inspector overlay.
- `/dev/:pageId`: editor with tree/containers and shared inspector behavior.
- `/design-system`: token editor, variant editor, and component support tables.
- `/components/:componentId`: component recipe/slots/props editing surface.

### Rendering Model
- Source of UI truth is a node tree (`PageNode[]`) and design config.
- Runtime path: `DesignSystemConfig + PageNode JSON -> renderer -> React components`.
- Preview and dev routes use the same render pipeline to prevent behavior drift.

### Theme Separation
- App shell keeps stable host theme on `:root`.
- Preview surface uses scoped design-system vars (for example `[data-ds="preview"]`) so user theme edits do not leak into shell UI.

### Persistence and Versioning
- Persist full project state in browser `localStorage` as a versioned envelope.
- Use schema versioning and migration hooks for forward compatibility.
- Export artifacts include `designSystemVersion` and `generatorVersion` to guarantee reproducibility.

## Important Public Interfaces / Types
| Interface | Purpose | Required Fields |
| --- | --- | --- |
| `DesignSystemConfig` | Single source of truth for design/runtime. | `designSystemVersion`, `generatorVersion`, `themes`, `tokens`, `componentRecipes`, `componentRegistry`, `pages` |
| `ThemeTokens` | Scoped theme variable sets. | `light`, `dark`, semantic token pairs including `accent` and `accentForeground` |
| `ComponentRecipe` | CVA-like variant contract per component. | `componentId`, `variants`, `sizes`, `states`, `defaultVariant` |
| `ComponentRegistryEntry` | Metadata and capability declaration. | `componentId`, `allowedProps`, `supportedTokens`, `supportedVariants`, `slots` |
| `PageNode` | Render tree node for runtime/editor. | `id`, `type`, `props`, `children`, `layout` |
| `InteractionSpec` | Click/action behavior wiring. | `type` (`navigate`/`open`/`submit`), `targetId`, optional `conditions` |
| `PersistenceEnvelope` | localStorage payload with migration support. | `schemaVersion`, `savedAt`, `config` |

## Phases
### Phase 0: Foundation and Quality Baseline
- Pin runtime requirements (Node and Bun policy).
- Normalize baseline quality gates to green (`lint`, `test`, `build`) by fixing existing lint/test gaps.
- Scaffold route shells for `/preview/:pageId`, `/dev/:pageId`, `/design-system`, `/components/:componentId`.
- Define initial shared types for config and renderer input.

### Phase 1: MVP Editor + Preview + Token System
- Implement shared runtime renderer from node tree JSON.
- Implement container/tree editor actions (add, remove, reorder, nest) in `/dev/:pageId`.
- Implement preview inspector click UX and interaction assignment.
- Implement token editing and live theme propagation in `/design-system`.
- Implement `localStorage` load/save using `PersistenceEnvelope`.

### Phase 2: Export v1 (Generated Shadcn Kit + Tailwind Preset)
- Build template-driven export pipeline based on current config.
- Generate:
  - `tokens.css` (theme variable output)
  - `tailwind.preset.ts` (token mapping)
  - `components/ui/*.tsx` from templates with injected variants
  - shared utilities and export README
- Stamp artifacts with config and generator versions.

### Phase 3: Figma Spec + Optional Backend
- Emit Figma-compatible spec JSON from design system config.
- Build import flow (plugin or adapter) to reconstruct variables/components/variants.
- Optional backend introduction for collaboration/version history.

## Acceptance Criteria
### Phase 0 Acceptance
- Route entries exist and are navigable for all planned modes.
- Runtime version policy is documented and tooling-ready.
- `bun --bun run lint`, `bun --bun run test`, and `bun --bun run build` are expected to pass in CI baseline.

### Phase 1 Acceptance (MVP)
- Editing node tree in `/dev/:pageId` updates preview output using the same renderer contract.
- Clicking a preview component opens inspector actions and persists interaction assignments.
- Editing tokens in `/design-system` updates preview theme live.
- Reloading browser restores the last valid local project state from `localStorage`.
- Invalid or unknown schema versions are handled gracefully without app crash.

### Phase 2 Acceptance
- Export command produces deterministic artifact file names and structure.
- Export output reflects active config values for tokens and component variants.
- Exported output includes version stamps for reproducibility.

### Phase 3 Acceptance
- Figma spec output contains enough token/component metadata to reconstruct system primitives.
- Optional backend mode supports saving and loading versioned configs without breaking local-first mode.

## Testing Strategy
### Unit Tests
- `DesignSystemConfig` serialization/deserialization preserves schema and round-trips.
- Schema migration logic handles unknown or older versions safely.
- Interaction assignment reducers/actions persist expected `InteractionSpec` values.

### Integration Tests
- Token edits in `/design-system` propagate to `/preview/:pageId`.
- Node tree edits in `/dev/:pageId` render correctly in preview with no layout desync.
- Inspector interaction assignments are applied and restored after reload.
- `localStorage` restore logic loads latest valid envelope and fallback behavior works for invalid data.

### Export Validation Tests (Phase 2)
- Artifact generation uses version metadata and deterministic naming.
- Component recipe variants appear correctly in generated templates.

### Release Gate
- Required checks before release:
  - `bun --bun run lint`
  - `bun --bun run test`
  - `bun --bun run build`

## Operational Constraints
- Local-first persistence is mandatory for MVP.
- Generated code should come from repository templates plus config, not hand-maintained output.
- Keep preview rendering contract stable across `/preview` and `/dev`.
- Keep shell and preview themes isolated to avoid unintended style coupling.

## Risks and Mitigations
- Risk: preview/editor divergence if separate render paths emerge.
  - Mitigation: enforce one renderer implementation and shared test coverage.
- Risk: schema drift in persisted local state.
  - Mitigation: explicit `schemaVersion`, migration functions, and fallback defaults.
- Risk: fragile export output when templates evolve.
  - Mitigation: version stamps, snapshot tests, deterministic generation rules.
- Risk: quality gate friction from current baseline failures.
  - Mitigation: Phase 0 includes lint/test baseline remediation before feature expansion.

## Out of Scope (Current MVP)
- Multi-user collaboration, presence, permissions.
- Cloud-hosted project storage.
- Production-grade Figma plugin distribution.
- Advanced animation timeline tooling or pixel-canvas editor model.

## Assumptions and Defaults
- `AGENTS.md` audience: AI + human.
- Planning horizon: MVP-first.
- Phase 1 priority: preview + editor.
- MVP includes token editor.
- Persistence for MVP: browser localStorage.
- Export v1 is Phase 2, not MVP.
- `src/components/ui/*` remains editable baseline code.
- Required completion checks: lint + test + build.
- Runtime policy: pin and enforce Node/Bun versions.
