## ADDED Requirements

### Requirement: Diff preview before file mutation
The system MUST present a file-level diff preview for all pending changes before allowing apply actions.

#### Scenario: User requests diff review
- **WHEN** the user opens the change review step with pending edits
- **THEN** the studio SHALL display proposed modifications grouped by file before any write occurs

### Requirement: Explicit apply for filesystem writes
The system MUST write project files only after the user explicitly confirms apply.

#### Scenario: User has not confirmed apply
- **WHEN** pending changes exist and no apply confirmation has been given
- **THEN** the system SHALL NOT write any target file

### Requirement: Apply result reporting
The system MUST report apply outcomes for each targeted file, including success and failure details.

#### Scenario: Mixed apply results
- **WHEN** an apply operation succeeds for some files and fails for others
- **THEN** the studio SHALL present per-file status so the user can take follow-up action
