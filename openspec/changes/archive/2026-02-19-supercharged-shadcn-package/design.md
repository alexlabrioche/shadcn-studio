## Context

This change introduces a package-distributed studio for shadcn-based design systems that runs locally inside an existing React project. The proposal defines five capabilities: CLI bootstrap, local runtime, token editing, diff-and-apply, and safe file generation.  
Key constraints are explicit-write safety (no install-time writes), predictable/idempotent outputs, and compatibility with existing project structure (custom `components/ui` path, `components.json`, styles path, and script naming).

## Goals / Non-Goals

**Goals:**
- Provide a single npm package that includes both CLI setup and a local studio runtime.
- Minimize adoption friction by supporting existing project layouts through guided init prompts.
- Make all project mutations user-controlled via previewed diffs and explicit apply actions.
- Keep generated output deterministic so reruns do not create noisy file churn.
- Establish an architecture that can expand from token editing to broader component customization.

**Non-Goals:**
- Replacing shadcn/ui upstream tooling or acting as a full package manager for UI dependencies.
- Automatic background file rewrites without a user-triggered apply step.
- Solving every framework integration in the first version (focus on React-first MVP).
- Advanced refactor automation (e.g., semantic component rewrites across arbitrary codebases) in initial scope.

## Decisions

### 1. Package shape: one npm package with CLI + studio runtime

The package ships a CLI entrypoint (`init`, `dev`) and a local web app runtime. This keeps onboarding and runtime behavior version-aligned and avoids split-version issues between a separate CLI and UI package.

Alternatives considered:
- Separate CLI and renderer packages: improves modularity but increases version coordination and user confusion.
- Pure library integration: does not satisfy the product requirement for a standalone studio UX.

### 2. Config-first project integration

`init` writes a studio config file (default `shadcn-studio.config.ts`) that stores resolved paths and behavior options (ui path, components config path, styles target, run script, port, conflict policy). Runtime reads this config as the single source of truth.

Alternatives considered:
- Convention-only (no config): too fragile across non-standard repos.
- Multiple independent config files: higher cognitive load and drift risk.

### 3. Two-phase change model: compute patch set, then apply

Editing operations produce an in-memory patch set (diff objects) rather than immediate file writes. The studio surfaces previews, and writes occur only on explicit apply.

Alternatives considered:
- Direct write-on-change: faster feedback but violates safety guardrails.
- Manual copy/paste export: safest, but poor usability and high error rate.

### 4. Idempotent generators with stable formatting strategy

File generators must be deterministic for identical inputs, with canonical output ordering and stable serialization. Where formatter integration is available, formatting runs as a post-generation normalization step; if unavailable, generator output still remains stable.

Alternatives considered:
- Rely only on host project formatters: inconsistent behavior when missing or misconfigured.
- Free-form template writes: easy to build but high risk of repeated diff churn.

### 5. Conflict policy is explicit and user-configurable

Conflict handling is a first-class setting (`ask` default, plus `skip` and `overwrite`). The apply engine reports conflict granularity by file and operation so users can resolve intentionally.

Alternatives considered:
- Always overwrite: unsafe for local customizations.
- Always fail on any conflict: safest but blocks practical iteration.

### 6. MVP scope: tokens-first with extensible pipeline

Initial runtime targets token/style editing and preview; component-level editing is designed as a later extension using the same diff/apply pipeline.

Alternatives considered:
- Broad component editing in v1: higher complexity and slower delivery.
- Tokens-only forever: limits long-term product value.

## Risks / Trade-offs

- [Diff correctness for mixed code styles] -> Use parser-aware transforms when possible; fall back to conservative file-level diffs with clear warnings.
- [Project layout variability causes init/runtime failures] -> Validate paths at init and startup with actionable diagnostics and autofix suggestions.
- [Idempotency breaks from formatter/environment differences] -> Add snapshot-based golden tests over generated outputs and normalize serialization order.
- [Scope creep from "supercharged" expectations] -> Lock MVP boundaries (tokens + safe apply) and gate additional capabilities behind follow-up specs.
- [User trust erosion from accidental writes] -> Enforce explicit apply path in architecture and test install/init commands for zero unintended writes.

## Migration Plan

1. Introduce package skeleton with CLI commands and config schema.
2. Implement `init` flow with prompts, validation, and config/script wiring.
3. Implement local studio runtime capable of loading config and project context.
4. Implement token editing + preview + patch generation.
5. Implement diff review and explicit apply with conflict policies.
6. Roll out as npm prerelease for pilot repos, gather feedback, then stabilize.

Rollback strategy:
- Disable `apply` command in released builds if critical write safety issues are found.
- Preserve read-only studio functionality while patch engine fixes are deployed.

## Open Questions

- Should `init` support non-interactive mode flags in MVP, or defer to a follow-up change?
- Which file transform layer should be default for style/token targets (AST-based vs template-based)?
- Should studio runtime embed a minimal preview shell or require host-app integration hooks?
- What telemetry (if any) is acceptable for debugging generator failures in local-only workflows?
