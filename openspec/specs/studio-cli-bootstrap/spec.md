# studio-cli-bootstrap Specification

## Purpose
TBD - created by archiving change supercharged-shadcn-package. Update Purpose after archive.
## Requirements
### Requirement: Interactive bootstrap for existing projects
The system MUST provide an `init` command that configures the studio in an existing React project and captures required setup values for script name, UI path, `components.json` path, studio config path, styles target, port, and conflict policy.

#### Scenario: User accepts prompted defaults
- **WHEN** the user runs `shadcn-studio init` in a compatible project and accepts defaults
- **THEN** the CLI SHALL persist a valid studio configuration file with default values and report the created paths/settings

### Requirement: Bootstrap validation before writing config
The system MUST validate that configured paths and script targets are syntactically valid before completing bootstrap.

#### Scenario: Invalid target path is entered
- **WHEN** the user enters a malformed or unsupported path during `init`
- **THEN** the CLI SHALL display a validation error and require correction before writing configuration output

