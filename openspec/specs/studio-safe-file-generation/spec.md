# studio-safe-file-generation Specification

## Purpose
TBD - created by archiving change supercharged-shadcn-package. Update Purpose after archive.
## Requirements
### Requirement: No installation-time project writes
The package MUST NOT modify user project files during dependency installation.

#### Scenario: Package is installed
- **WHEN** a user installs the package with npm, pnpm, or bun
- **THEN** no project source, config, or style files SHALL be created or modified during install

### Requirement: Idempotent generation output
For identical inputs, the generation pipeline MUST produce equivalent file content on repeated runs.

#### Scenario: Repeated generation with unchanged inputs
- **WHEN** the user runs generation/apply twice with the same configuration and token state
- **THEN** the second run SHALL produce no additional content changes

### Requirement: Configurable conflict strategy
The apply pipeline MUST support `ask`, `skip`, and `overwrite` conflict strategies defined by user configuration.

#### Scenario: Conflict detected in ask mode
- **WHEN** a target file has conflicting local content and strategy is `ask`
- **THEN** the system SHALL prompt for a user decision before writing that file

