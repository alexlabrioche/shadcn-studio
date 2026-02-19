## ADDED Requirements

### Requirement: Local studio runtime startup
The system MUST provide a local runtime command that starts the studio UI using project-resolved configuration and reports the local access URL.

#### Scenario: Runtime starts with valid configuration
- **WHEN** the user runs the studio dev command in a project with valid studio config
- **THEN** the runtime SHALL start successfully and expose a local studio URL

### Requirement: Project context loading
The runtime MUST load configured project context (UI path, styles path, and related inputs) before enabling editing workflows.

#### Scenario: Required project context is missing
- **WHEN** the runtime cannot resolve a required configured path at startup
- **THEN** the studio SHALL block editing actions and show actionable diagnostics to fix configuration
