## ADDED Requirements

### Requirement: Visual token editing controls
The studio MUST allow users to edit design-token values used by the target shadcn-based system through a visual interface instead of direct file editing.

#### Scenario: User edits a token value
- **WHEN** the user changes a token value in the studio controls
- **THEN** the studio SHALL update the pending token state and mark the workspace as having unapplied changes

### Requirement: Live preview from pending token state
The studio MUST render a preview that reflects pending token edits before any filesystem write occurs.

#### Scenario: Preview reflects unapplied edits
- **WHEN** token values are changed but not yet applied
- **THEN** previewed UI output SHALL reflect the updated values while project files remain unchanged
