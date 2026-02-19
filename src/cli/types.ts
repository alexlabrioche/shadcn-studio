export const CONFLICT_STRATEGIES = ['ask', 'skip', 'overwrite'] as const

export type ConflictStrategy = (typeof CONFLICT_STRATEGIES)[number]

export interface StudioConfig {
  scriptName: string
  uiPath: string
  componentsPath: string
  configPath: string
  stylesPath: string
  port: number
  conflictStrategy: ConflictStrategy
}

export const DEFAULT_STUDIO_CONFIG: StudioConfig = {
  scriptName: 'studio-dev',
  uiPath: 'src/components/ui',
  componentsPath: 'components.json',
  configPath: 'shadcn-studio.config.ts',
  stylesPath: 'src/styles.css',
  port: 3011,
  conflictStrategy: 'ask',
}

export interface RuntimePathCheck {
  key: 'uiPath' | 'componentsPath' | 'stylesPath'
  absolutePath: string
  expectedKind: 'file' | 'directory'
  exists: boolean
}

export interface StudioPatch {
  targetPath: string
  before: string
  after: string
  diff: string
  hasChanges: boolean
}

export interface StudioApplyResult {
  targetPath: string
  status: 'applied' | 'skipped' | 'noop' | 'error'
  reason?: string
}
