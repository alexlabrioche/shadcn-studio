const HEX_COLOR_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const NUMBER_TOKEN_PATTERN = /^[+-]?(?:\d+\.?\d*|\.\d+)$/
const PERCENT_TOKEN_PATTERN = /^[+-]?(?:\d+\.?\d*|\.\d+)%$/
const PAIR_NAME_PATTERN = /^[a-z][a-z0-9-]*$/

export type ThemeColor = string
export type CssExportColorFormat = 'oklch' | 'hex'
export type ThemeMode = 'light' | 'dark'
export type AppAppearance = 'light' | 'dark'

export interface ThemeColorPair {
  name: string
  label: string
  color: ThemeColor
  foreground: ThemeColor
  includeInButtonVariant: boolean
  isCustom: boolean
}

export interface ThemePalette {
  colorPairs: ThemeColorPair[]
}

export interface MainTheme {
  light: ThemePalette
  dark: ThemePalette
}

export interface AddThemeColorPairInput {
  name: string
  label?: string
  color?: ThemeColor
  foreground?: ThemeColor
  includeInButtonVariant: boolean
}

export interface AddThemeColorPairResult {
  theme: MainTheme
  error: string | null
}

export const MAIN_THEME_STORAGE_KEY = 'giga-shad.main-theme.v2'
export const LEGACY_MAIN_THEME_STORAGE_KEY = 'giga-shad.main-theme.v1'

const RESERVED_BUTTON_VARIANT_NAMES = new Set([
  'default',
  'destructive',
  'outline',
  'secondary',
  'ghost',
  'link',
])

type BuiltInThemePairDefinition = {
  name: string
  label: string
  colorToken: string
  foregroundToken: string
}

const BUILT_IN_THEME_PAIR_DEFINITIONS: ReadonlyArray<BuiltInThemePairDefinition> = [
  {
    name: 'background',
    label: 'Background',
    colorToken: 'background',
    foregroundToken: 'foreground',
  },
  {
    name: 'card',
    label: 'Card',
    colorToken: 'card',
    foregroundToken: 'card-foreground',
  },
  {
    name: 'popover',
    label: 'Popover',
    colorToken: 'popover',
    foregroundToken: 'popover-foreground',
  },
  {
    name: 'primary',
    label: 'Primary',
    colorToken: 'primary',
    foregroundToken: 'primary-foreground',
  },
  {
    name: 'secondary',
    label: 'Secondary',
    colorToken: 'secondary',
    foregroundToken: 'secondary-foreground',
  },
  {
    name: 'muted',
    label: 'Muted',
    colorToken: 'muted',
    foregroundToken: 'muted-foreground',
  },
  {
    name: 'accent',
    label: 'Accent',
    colorToken: 'accent',
    foregroundToken: 'accent-foreground',
  },
  {
    name: 'sidebar',
    label: 'Sidebar',
    colorToken: 'sidebar',
    foregroundToken: 'sidebar-foreground',
  },
  {
    name: 'sidebar-primary',
    label: 'Sidebar Primary',
    colorToken: 'sidebar-primary',
    foregroundToken: 'sidebar-primary-foreground',
  },
  {
    name: 'sidebar-accent',
    label: 'Sidebar Accent',
    colorToken: 'sidebar-accent',
    foregroundToken: 'sidebar-accent-foreground',
  },
]

const BUILT_IN_THEME_PAIR_NAMES = new Set(
  BUILT_IN_THEME_PAIR_DEFINITIONS.map((definition) => definition.name),
)

const SHADCN_THEME_INLINE_BASE_LINES = [
  '  --radius-sm: calc(var(--radius) - 4px);',
  '  --radius-md: calc(var(--radius) - 2px);',
  '  --radius-lg: var(--radius);',
  '  --radius-xl: calc(var(--radius) + 4px);',
  '  --radius-2xl: calc(var(--radius) + 8px);',
  '  --radius-3xl: calc(var(--radius) + 12px);',
  '  --radius-4xl: calc(var(--radius) + 16px);',
  '  --color-background: var(--background);',
  '  --color-foreground: var(--foreground);',
  '  --color-card: var(--card);',
  '  --color-card-foreground: var(--card-foreground);',
  '  --color-popover: var(--popover);',
  '  --color-popover-foreground: var(--popover-foreground);',
  '  --color-primary: var(--primary);',
  '  --color-primary-foreground: var(--primary-foreground);',
  '  --color-secondary: var(--secondary);',
  '  --color-secondary-foreground: var(--secondary-foreground);',
  '  --color-muted: var(--muted);',
  '  --color-muted-foreground: var(--muted-foreground);',
  '  --color-accent: var(--accent);',
  '  --color-accent-foreground: var(--accent-foreground);',
  '  --color-destructive: var(--destructive);',
  '  --color-border: var(--border);',
  '  --color-input: var(--input);',
  '  --color-ring: var(--ring);',
  '  --color-chart-1: var(--chart-1);',
  '  --color-chart-2: var(--chart-2);',
  '  --color-chart-3: var(--chart-3);',
  '  --color-chart-4: var(--chart-4);',
  '  --color-chart-5: var(--chart-5);',
  '  --color-sidebar: var(--sidebar);',
  '  --color-sidebar-foreground: var(--sidebar-foreground);',
  '  --color-sidebar-primary: var(--sidebar-primary);',
  '  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);',
  '  --color-sidebar-accent: var(--sidebar-accent);',
  '  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);',
  '  --color-sidebar-border: var(--sidebar-border);',
  '  --color-sidebar-ring: var(--sidebar-ring);',
]

const SHADCN_LIGHT_THEME_VARIABLES: ReadonlyArray<readonly [string, string]> = [
  ['radius', '0.625rem'],
  ['background', 'oklch(1 0 0)'],
  ['foreground', 'oklch(0.147 0.004 49.25)'],
  ['card', 'oklch(1 0 0)'],
  ['card-foreground', 'oklch(0.147 0.004 49.25)'],
  ['popover', 'oklch(1 0 0)'],
  ['popover-foreground', 'oklch(0.147 0.004 49.25)'],
  ['primary', 'oklch(0.216 0.006 56.043)'],
  ['primary-foreground', 'oklch(0.985 0.001 106.423)'],
  ['secondary', 'oklch(0.97 0.001 106.424)'],
  ['secondary-foreground', 'oklch(0.216 0.006 56.043)'],
  ['muted', 'oklch(0.97 0.001 106.424)'],
  ['muted-foreground', 'oklch(0.553 0.013 58.071)'],
  ['accent', 'oklch(0.97 0.001 106.424)'],
  ['accent-foreground', 'oklch(0.216 0.006 56.043)'],
  ['destructive', 'oklch(0.577 0.245 27.325)'],
  ['border', 'oklch(0.923 0.003 48.717)'],
  ['input', 'oklch(0.923 0.003 48.717)'],
  ['ring', 'oklch(0.709 0.01 56.259)'],
  ['chart-1', 'oklch(0.646 0.222 41.116)'],
  ['chart-2', 'oklch(0.6 0.118 184.704)'],
  ['chart-3', 'oklch(0.398 0.07 227.392)'],
  ['chart-4', 'oklch(0.828 0.189 84.429)'],
  ['chart-5', 'oklch(0.769 0.188 70.08)'],
  ['sidebar', 'oklch(0.985 0.001 106.423)'],
  ['sidebar-foreground', 'oklch(0.147 0.004 49.25)'],
  ['sidebar-primary', 'oklch(0.216 0.006 56.043)'],
  ['sidebar-primary-foreground', 'oklch(0.985 0.001 106.423)'],
  ['sidebar-accent', 'oklch(0.97 0.001 106.424)'],
  ['sidebar-accent-foreground', 'oklch(0.216 0.006 56.043)'],
  ['sidebar-border', 'oklch(0.923 0.003 48.717)'],
  ['sidebar-ring', 'oklch(0.709 0.01 56.259)'],
]

const SHADCN_DARK_THEME_VARIABLES: ReadonlyArray<readonly [string, string]> = [
  ['background', 'oklch(0.147 0.004 49.25)'],
  ['foreground', 'oklch(0.985 0.001 106.423)'],
  ['card', 'oklch(0.216 0.006 56.043)'],
  ['card-foreground', 'oklch(0.985 0.001 106.423)'],
  ['popover', 'oklch(0.216 0.006 56.043)'],
  ['popover-foreground', 'oklch(0.985 0.001 106.423)'],
  ['primary', 'oklch(0.923 0.003 48.717)'],
  ['primary-foreground', 'oklch(0.216 0.006 56.043)'],
  ['secondary', 'oklch(0.268 0.007 34.298)'],
  ['secondary-foreground', 'oklch(0.985 0.001 106.423)'],
  ['muted', 'oklch(0.268 0.007 34.298)'],
  ['muted-foreground', 'oklch(0.709 0.01 56.259)'],
  ['accent', 'oklch(0.268 0.007 34.298)'],
  ['accent-foreground', 'oklch(0.985 0.001 106.423)'],
  ['destructive', 'oklch(0.704 0.191 22.216)'],
  ['border', 'oklch(1 0 0 / 10%)'],
  ['input', 'oklch(1 0 0 / 15%)'],
  ['ring', 'oklch(0.553 0.013 58.071)'],
  ['chart-1', 'oklch(0.488 0.243 264.376)'],
  ['chart-2', 'oklch(0.696 0.17 162.48)'],
  ['chart-3', 'oklch(0.769 0.188 70.08)'],
  ['chart-4', 'oklch(0.627 0.265 303.9)'],
  ['chart-5', 'oklch(0.645 0.246 16.439)'],
  ['sidebar', 'oklch(0.216 0.006 56.043)'],
  ['sidebar-foreground', 'oklch(0.985 0.001 106.423)'],
  ['sidebar-primary', 'oklch(0.488 0.243 264.376)'],
  ['sidebar-primary-foreground', 'oklch(0.985 0.001 106.423)'],
  ['sidebar-accent', 'oklch(0.268 0.007 34.298)'],
  ['sidebar-accent-foreground', 'oklch(0.985 0.001 106.423)'],
  ['sidebar-border', 'oklch(1 0 0 / 10%)'],
  ['sidebar-ring', 'oklch(0.553 0.013 58.071)'],
]

const LIGHT_THEME_VARIABLE_MAP = new Map(SHADCN_LIGHT_THEME_VARIABLES)
const BUILT_IN_THEME_PAIR_DEFINITION_MAP = new Map(
  BUILT_IN_THEME_PAIR_DEFINITIONS.map((definition) => [definition.name, definition]),
)

type RgbaColor = {
  r: number
  g: number
  b: number
  a: number
}

type ParsedOklch = {
  l: number
  c: number
  h: number
  a: number
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min
  }
  if (value > max) {
    return max
  }
  return value
}

function normalizeHue(value: number): number {
  const wrapped = value % 360
  return wrapped < 0 ? wrapped + 360 : wrapped
}

function formatNumber(value: number, precision = 3): string {
  const rounded = Number(value.toFixed(precision))
  return Object.is(rounded, -0) ? '0' : rounded.toString()
}

function formatAlpha(value: number): string {
  return formatNumber(value, 3)
}

function channelToByte(value: number): number {
  return Math.round(clamp(value, 0, 1) * 255)
}

function rgbaToHex({ r, g, b, a }: RgbaColor): string {
  const red = channelToByte(r).toString(16).padStart(2, '0')
  const green = channelToByte(g).toString(16).padStart(2, '0')
  const blue = channelToByte(b).toString(16).padStart(2, '0')
  const alpha = channelToByte(a).toString(16).padStart(2, '0')
  if (alpha === 'ff') {
    return `#${red}${green}${blue}`
  }
  return `#${red}${green}${blue}${alpha}`
}

function parseHexColor(value: string): RgbaColor | null {
  if (!HEX_COLOR_PATTERN.test(value)) {
    return null
  }

  let hex = value.slice(1).toLowerCase()
  if (hex.length === 3 || hex.length === 4) {
    hex = hex
      .split('')
      .map((char) => `${char}${char}`)
      .join('')
  }
  if (hex.length === 6) {
    hex = `${hex}ff`
  }
  if (hex.length !== 8) {
    return null
  }

  const red = Number.parseInt(hex.slice(0, 2), 16)
  const green = Number.parseInt(hex.slice(2, 4), 16)
  const blue = Number.parseInt(hex.slice(4, 6), 16)
  const alpha = Number.parseInt(hex.slice(6, 8), 16)

  return {
    r: red / 255,
    g: green / 255,
    b: blue / 255,
    a: alpha / 255,
  }
}

function parseNumericToken(
  token: string,
  options: { allowPercent: boolean },
): number | null {
  const trimmed = token.trim()
  if (options.allowPercent && PERCENT_TOKEN_PATTERN.test(trimmed)) {
    return Number.parseFloat(trimmed.slice(0, -1)) / 100
  }
  if (NUMBER_TOKEN_PATTERN.test(trimmed)) {
    return Number.parseFloat(trimmed)
  }
  return null
}

function parseOklchColor(value: string): ParsedOklch | null {
  const trimmed = value.trim()
  if (!trimmed.toLowerCase().startsWith('oklch(') || !trimmed.endsWith(')')) {
    return null
  }

  const rawContent = trimmed.slice(6, -1).trim()
  const slashIndex = rawContent.indexOf('/')
  if (slashIndex !== -1 && rawContent.lastIndexOf('/') !== slashIndex) {
    return null
  }

  const channelPart =
    slashIndex === -1 ? rawContent : rawContent.slice(0, slashIndex)
  const alphaPart =
    slashIndex === -1 ? null : rawContent.slice(slashIndex + 1).trim()
  const channels = channelPart.trim().split(/\s+/)
  if (channels.length !== 3) {
    return null
  }

  const lightness = parseNumericToken(channels[0], { allowPercent: true })
  const chroma = parseNumericToken(channels[1], { allowPercent: false })
  const hue = parseNumericToken(channels[2], { allowPercent: false })
  if (
    lightness === null ||
    chroma === null ||
    hue === null ||
    lightness < 0 ||
    lightness > 1 ||
    chroma < 0
  ) {
    return null
  }

  const alpha =
    alphaPart === null || alphaPart.length === 0
      ? 1
      : parseNumericToken(alphaPart, { allowPercent: true })
  if (alpha === null || !Number.isFinite(alpha) || alpha < 0 || alpha > 1) {
    return null
  }

  return {
    l: lightness,
    c: chroma,
    h: normalizeHue(hue),
    a: alpha,
  }
}

function formatOklch({ l, c, h, a }: ParsedOklch): string {
  const color = `oklch(${formatNumber(l)} ${formatNumber(c)} ${formatNumber(h)})`
  if (a >= 1) {
    return color
  }
  return `${color.slice(0, -1)} / ${formatAlpha(a)})`
}

function normalizeHexColor(value: string): string | null {
  const parsed = parseHexColor(value)
  if (!parsed) {
    return null
  }
  return rgbaToHex(parsed)
}

function normalizeOklchColor(value: string): string | null {
  const parsed = parseOklchColor(value)
  if (!parsed) {
    return null
  }
  return formatOklch(parsed)
}

function srgbChannelToLinear(value: number): number {
  if (value <= 0.04045) {
    return value / 12.92
  }
  return ((value + 0.055) / 1.055) ** 2.4
}

function linearChannelToSrgb(value: number): number {
  if (value <= 0.0031308) {
    return 12.92 * value
  }
  return 1.055 * value ** (1 / 2.4) - 0.055
}

function oklchToHex(value: string): string | null {
  const parsed = parseOklchColor(value)
  if (!parsed) {
    return null
  }

  const hueInRadians = (parsed.h * Math.PI) / 180
  const a = parsed.c * Math.cos(hueInRadians)
  const b = parsed.c * Math.sin(hueInRadians)

  const lPrime = parsed.l + 0.3963377774 * a + 0.2158037573 * b
  const mPrime = parsed.l - 0.1055613458 * a - 0.0638541728 * b
  const sPrime = parsed.l - 0.0894841775 * a - 1.291485548 * b

  const l = lPrime ** 3
  const m = mPrime ** 3
  const s = sPrime ** 3

  const linearRed = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const linearGreen = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const linearBlue = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s

  return rgbaToHex({
    r: linearChannelToSrgb(clamp(linearRed, 0, 1)),
    g: linearChannelToSrgb(clamp(linearGreen, 0, 1)),
    b: linearChannelToSrgb(clamp(linearBlue, 0, 1)),
    a: parsed.a,
  })
}

function hexToOklch(value: string): string | null {
  const parsed = parseHexColor(value)
  if (!parsed) {
    return null
  }

  const linearRed = srgbChannelToLinear(parsed.r)
  const linearGreen = srgbChannelToLinear(parsed.g)
  const linearBlue = srgbChannelToLinear(parsed.b)

  const l =
    0.4122214708 * linearRed +
    0.5363325363 * linearGreen +
    0.0514459929 * linearBlue
  const m =
    0.2119034982 * linearRed +
    0.6806995451 * linearGreen +
    0.1073969566 * linearBlue
  const s =
    0.0883024619 * linearRed +
    0.2817188376 * linearGreen +
    0.6299787005 * linearBlue

  const lPrime = Math.cbrt(l)
  const mPrime = Math.cbrt(m)
  const sPrime = Math.cbrt(s)

  const lightness =
    0.2104542553 * lPrime + 0.793617785 * mPrime - 0.0040720468 * sPrime
  const a =
    1.9779984951 * lPrime - 2.428592205 * mPrime + 0.4505937099 * sPrime
  const b =
    0.0259040371 * lPrime + 0.7827717662 * mPrime - 0.808675766 * sPrime

  const chroma = Math.sqrt(a * a + b * b)
  const hue =
    chroma <= 1e-7 ? 0 : normalizeHue((Math.atan2(b, a) * 180) / Math.PI)

  return formatOklch({
    l: clamp(lightness, 0, 1),
    c: chroma,
    h: hue,
    a: parsed.a,
  })
}

function startCase(value: string): string {
  return value
    .split('-')
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function getBuiltInThemePairDefinition(
  pairName: string,
): BuiltInThemePairDefinition | undefined {
  return BUILT_IN_THEME_PAIR_DEFINITION_MAP.get(pairName)
}

const DARK_THEME_VARIABLE_MAP = new Map(SHADCN_DARK_THEME_VARIABLES)

function getBuiltInThemePairDefaults(
  definition: BuiltInThemePairDefinition,
  mode: ThemeMode,
): Pick<ThemeColorPair, 'color' | 'foreground'> {
  const variableMap =
    mode === 'light' ? LIGHT_THEME_VARIABLE_MAP : DARK_THEME_VARIABLE_MAP

  return {
    color: variableMap.get(definition.colorToken) ?? '#111827',
    foreground: variableMap.get(definition.foregroundToken) ?? '#f9fafb',
  }
}

function createDefaultColorPairs(mode: ThemeMode): ThemeColorPair[] {
  return BUILT_IN_THEME_PAIR_DEFINITIONS.map((definition) => {
    const defaults = getBuiltInThemePairDefaults(definition, mode)
    return {
      name: definition.name,
      label: definition.label,
      color: defaults.color,
      foreground: defaults.foreground,
      includeInButtonVariant: false,
      isCustom: false,
    }
  })
}

function cloneThemeColorPair(pair: ThemeColorPair): ThemeColorPair {
  return { ...pair }
}

function cloneThemePalette(palette: ThemePalette): ThemePalette {
  return {
    colorPairs: palette.colorPairs.map(cloneThemeColorPair),
  }
}

function cloneMainTheme(theme: MainTheme): MainTheme {
  return {
    light: cloneThemePalette(theme.light),
    dark: cloneThemePalette(theme.dark),
  }
}

const DEFAULT_THEME_PALETTE_BY_MODE: Record<ThemeMode, ThemePalette> = {
  light: {
    colorPairs: createDefaultColorPairs('light'),
  },
  dark: {
    colorPairs: createDefaultColorPairs('dark'),
  },
}

export const DEFAULT_MAIN_THEME: MainTheme = cloneMainTheme({
  light: DEFAULT_THEME_PALETTE_BY_MODE.light,
  dark: DEFAULT_THEME_PALETTE_BY_MODE.dark,
})

export function createDefaultMainTheme(): MainTheme {
  return cloneMainTheme(DEFAULT_MAIN_THEME)
}

const DEFAULT_THEME_PAIR_BY_MODE_AND_NAME: Record<
  ThemeMode,
  Map<string, ThemeColorPair>
> = {
  light: new Map(
    DEFAULT_THEME_PALETTE_BY_MODE.light.colorPairs.map((pair) => [pair.name, pair]),
  ),
  dark: new Map(
    DEFAULT_THEME_PALETTE_BY_MODE.dark.colorPairs.map((pair) => [pair.name, pair]),
  ),
}

function getDefaultThemePair(
  mode: ThemeMode,
  pairName: string,
): ThemeColorPair | null {
  const pair = DEFAULT_THEME_PAIR_BY_MODE_AND_NAME[mode].get(pairName)
  return pair ? cloneThemeColorPair(pair) : null
}

function getThemePalette(theme: MainTheme, mode: ThemeMode): ThemePalette {
  return mode === 'light' ? theme.light : theme.dark
}

export function normalizeThemePairName(value: string): string | null {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  if (!PAIR_NAME_PATTERN.test(normalized)) {
    return null
  }

  return normalized
}

export function normalizeThemeColor(value: unknown): ThemeColor | null {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  if (trimmed.length === 0) {
    return null
  }

  return normalizeHexColor(trimmed) ?? normalizeOklchColor(trimmed)
}

export function isThemeColor(value: unknown): value is ThemeColor {
  return normalizeThemeColor(value) !== null
}

export function toHexColor(value: ThemeColor): string | null {
  return normalizeHexColor(value) ?? oklchToHex(value)
}

export function toOklchColor(value: ThemeColor): string | null {
  return normalizeOklchColor(value) ?? hexToOklch(value)
}

function ensureThemeColor(value: unknown, fallback: ThemeColor): ThemeColor {
  return normalizeThemeColor(value) ?? fallback
}

function formatColorForExport(
  value: ThemeColor,
  colorFormat: CssExportColorFormat,
): string {
  if (colorFormat === 'hex') {
    return toHexColor(value) ?? value
  }
  return toOklchColor(value) ?? value
}

function ensureThemeColorPair(
  value: unknown,
  fallback: ThemeColorPair,
): ThemeColorPair | null {
  if (!isRecord(value)) {
    return null
  }

  const name = normalizeThemePairName(typeof value.name === 'string' ? value.name : '')
  if (!name) {
    return null
  }

  const builtInDefinition = getBuiltInThemePairDefinition(name)
  const label =
    typeof value.label === 'string' && value.label.trim().length > 0
      ? value.label.trim()
      : builtInDefinition?.label ?? startCase(name)

  return {
    name,
    label,
    color: ensureThemeColor(value.color, fallback.color),
    foreground: ensureThemeColor(value.foreground, fallback.foreground),
    includeInButtonVariant:
      !builtInDefinition && Boolean(value.includeInButtonVariant),
    isCustom: !builtInDefinition,
  }
}

function mergeColorPairsWithDefaults(
  pairs: ThemeColorPair[],
  mode: ThemeMode,
): ThemeColorPair[] {
  const builtInOverrides = new Map<string, ThemeColorPair>()
  const customPairs: ThemeColorPair[] = []
  const seenCustom = new Set<string>()

  for (const pair of pairs) {
    if (BUILT_IN_THEME_PAIR_NAMES.has(pair.name)) {
      builtInOverrides.set(pair.name, {
        ...pair,
        includeInButtonVariant: false,
        isCustom: false,
      })
      continue
    }

    if (seenCustom.has(pair.name)) {
      continue
    }

    seenCustom.add(pair.name)
    customPairs.push({
      ...pair,
      label: pair.label.trim().length > 0 ? pair.label : startCase(pair.name),
      includeInButtonVariant: Boolean(pair.includeInButtonVariant),
      isCustom: true,
    })
  }

  const builtInPairs = BUILT_IN_THEME_PAIR_DEFINITIONS.map((definition) => {
    const override = builtInOverrides.get(definition.name)
    const fallback = getDefaultThemePair(mode, definition.name)
    if (override) {
      return {
        ...override,
        label: definition.label,
        includeInButtonVariant: false,
        isCustom: false,
      }
    }

    if (fallback) {
      return { ...fallback }
    }

    const defaults = getBuiltInThemePairDefaults(definition, mode)
    return {
      name: definition.name,
      label: definition.label,
      color: defaults.color,
      foreground: defaults.foreground,
      includeInButtonVariant: false,
      isCustom: false,
    }
  })

  return [...builtInPairs, ...customPairs]
}

function normalizeThemePalette(
  pairs: ThemeColorPair[],
  mode: ThemeMode,
): ThemePalette {
  return {
    colorPairs: mergeColorPairsWithDefaults(pairs, mode),
  }
}

function getPrimaryPairDefaultsForPalette(
  palette: ThemePalette,
  mode: ThemeMode,
): Pick<ThemeColorPair, 'color' | 'foreground'> {
  const primaryPair = palette.colorPairs.find((pair) => pair.name === 'primary')
  if (primaryPair) {
    return {
      color: primaryPair.color,
      foreground: primaryPair.foreground,
    }
  }

  const defaultPrimaryPair = getDefaultThemePair(mode, 'primary')
  return {
    color: defaultPrimaryPair?.color ?? '#111827',
    foreground: defaultPrimaryPair?.foreground ?? '#f9fafb',
  }
}

function createCustomPairForPalette(
  palette: ThemePalette,
  mode: ThemeMode,
  options: {
    name: string
    label: string
    includeInButtonVariant: boolean
    color?: unknown
    foreground?: unknown
  },
): ThemeColorPair {
  const primaryDefaults = getPrimaryPairDefaultsForPalette(palette, mode)
  return {
    name: options.name,
    label: options.label,
    color: ensureThemeColor(options.color, primaryDefaults.color),
    foreground: ensureThemeColor(options.foreground, primaryDefaults.foreground),
    includeInButtonVariant: options.includeInButtonVariant,
    isCustom: true,
  }
}

function getThemePairTokenNames(pair: ThemeColorPair): {
  colorToken: string
  foregroundToken: string
} {
  const builtInDefinition = getBuiltInThemePairDefinition(pair.name)
  if (builtInDefinition) {
    return {
      colorToken: builtInDefinition.colorToken,
      foregroundToken: builtInDefinition.foregroundToken,
    }
  }

  return {
    colorToken: pair.name,
    foregroundToken: `${pair.name}-foreground`,
  }
}

function getThemeVariablesWithOverrides(
  theme: MainTheme,
  mode: ThemeMode,
): ReadonlyArray<readonly [string, string]> {
  const baseVariables =
    mode === 'light' ? SHADCN_LIGHT_THEME_VARIABLES : SHADCN_DARK_THEME_VARIABLES
  const variables = new Map<string, string>(baseVariables)

  for (const pair of getThemeColorPairs(theme, mode)) {
    const tokenNames = getThemePairTokenNames(pair)
    variables.set(tokenNames.colorToken, pair.color)
    variables.set(tokenNames.foregroundToken, pair.foreground)
  }

  const orderedBaseVariables = baseVariables.map(([name]) => [
    name,
    variables.get(name) ?? '',
  ])

  const customVariables = getCustomThemeColorPairs(theme, mode).flatMap((pair) => {
    const tokenNames = getThemePairTokenNames(pair)
    return [
      [tokenNames.colorToken, variables.get(tokenNames.colorToken) ?? pair.color],
      [
        tokenNames.foregroundToken,
        variables.get(tokenNames.foregroundToken) ?? pair.foreground,
      ],
    ]
  })

  return [...orderedBaseVariables, ...customVariables]
}

function mapThemeVariablesForExport(
  variables: ReadonlyArray<readonly [string, string]>,
  colorFormat: CssExportColorFormat,
): ReadonlyArray<readonly [string, string]> {
  return variables.map(([name, value]) => [
    name,
    formatColorForExport(value, colorFormat),
  ])
}

function formatCssVariableBlock(
  selector: string,
  variables: ReadonlyArray<readonly [string, string]>,
): string {
  const lines = variables.map(([name, value]) => `  --${name}: ${value};`)
  return `${selector} {\n${lines.join('\n')}\n}`
}

function formatThemeInlineBlock(theme: MainTheme): string {
  const customPairLines = getCustomThemeColorPairs(theme, 'light').flatMap(
    (pair) => [
      `  --color-${pair.name}: var(--${pair.name});`,
      `  --color-${pair.name}-foreground: var(--${pair.name}-foreground);`,
    ],
  )

  return `@theme inline {\n${[
    ...SHADCN_THEME_INLINE_BASE_LINES,
    ...customPairLines,
  ].join('\n')}\n}`
}

function parseThemeColorPairsFromUnknown(
  rawPairs: unknown,
  mode: ThemeMode,
): ThemeColorPair[] | null {
  if (!Array.isArray(rawPairs)) {
    return null
  }

  const parsedPairs: ThemeColorPair[] = []

  for (const pairCandidate of rawPairs) {
    if (!isRecord(pairCandidate)) {
      continue
    }

    const name = normalizeThemePairName(
      typeof pairCandidate.name === 'string' ? pairCandidate.name : '',
    )
    if (!name) {
      continue
    }

    const fallbackPair =
      getDefaultThemePair(mode, name) ??
      createCustomPairForPalette(normalizeThemePalette([], mode), mode, {
        name,
        label: startCase(name),
        includeInButtonVariant: false,
      })

    const pair = ensureThemeColorPair(pairCandidate, fallbackPair)
    if (pair) {
      parsedPairs.push(pair)
    }
  }

  return parsedPairs
}

function synchronizeThemePalettes(
  lightPalette: ThemePalette,
  darkPalette: ThemePalette,
): MainTheme {
  const normalizedLight = normalizeThemePalette(lightPalette.colorPairs, 'light')
  const normalizedDark = normalizeThemePalette(darkPalette.colorPairs, 'dark')

  const lightBuiltInPairs = normalizedLight.colorPairs.filter(
    (pair) => !pair.isCustom,
  )
  const darkBuiltInPairs = normalizedDark.colorPairs.filter((pair) => !pair.isCustom)

  const lightCustomPairs = normalizedLight.colorPairs.filter((pair) => pair.isCustom)
  const darkCustomPairs = normalizedDark.colorPairs.filter((pair) => pair.isCustom)

  const lightCustomPairByName = new Map(
    lightCustomPairs.map((pair) => [pair.name, pair]),
  )
  const darkCustomPairByName = new Map(darkCustomPairs.map((pair) => [pair.name, pair]))

  const customPairNames: string[] = []
  const seenCustomNames = new Set<string>()

  for (const pair of lightCustomPairs) {
    if (!seenCustomNames.has(pair.name)) {
      seenCustomNames.add(pair.name)
      customPairNames.push(pair.name)
    }
  }

  for (const pair of darkCustomPairs) {
    if (!seenCustomNames.has(pair.name)) {
      seenCustomNames.add(pair.name)
      customPairNames.push(pair.name)
    }
  }

  const syncedLightCustomPairs: ThemeColorPair[] = []
  const syncedDarkCustomPairs: ThemeColorPair[] = []

  for (const name of customPairNames) {
    const lightPair = lightCustomPairByName.get(name)
    const darkPair = darkCustomPairByName.get(name)
    const sourcePair = lightPair ?? darkPair
    const label =
      sourcePair && sourcePair.label.trim().length > 0
        ? sourcePair.label
        : startCase(name)
    const includeInButtonVariant = Boolean(sourcePair?.includeInButtonVariant)

    const syncedLightPair =
      lightPair ??
      createCustomPairForPalette(normalizedLight, 'light', {
        name,
        label,
        includeInButtonVariant,
      })
    const syncedDarkPair =
      darkPair ??
      createCustomPairForPalette(normalizedDark, 'dark', {
        name,
        label,
        includeInButtonVariant,
      })

    syncedLightCustomPairs.push({
      ...syncedLightPair,
      name,
      label,
      includeInButtonVariant,
      isCustom: true,
    })
    syncedDarkCustomPairs.push({
      ...syncedDarkPair,
      name,
      label,
      includeInButtonVariant,
      isCustom: true,
    })
  }

  return {
    light: {
      colorPairs: [...lightBuiltInPairs, ...syncedLightCustomPairs],
    },
    dark: {
      colorPairs: [...darkBuiltInPairs, ...syncedDarkCustomPairs],
    },
  }
}

function createThemeFromPalettePairs(
  lightPairs: ThemeColorPair[],
  darkPairs: ThemeColorPair[],
): MainTheme {
  return synchronizeThemePalettes(
    normalizeThemePalette(lightPairs, 'light'),
    normalizeThemePalette(darkPairs, 'dark'),
  )
}

function normalizeMainTheme(value: unknown): MainTheme | null {
  if (!isRecord(value)) {
    return null
  }

  const maybeLightPairs = isRecord(value.light)
    ? parseThemeColorPairsFromUnknown(value.light.colorPairs, 'light')
    : null
  const maybeDarkPairs = isRecord(value.dark)
    ? parseThemeColorPairsFromUnknown(value.dark.colorPairs, 'dark')
    : null
  if (maybeLightPairs || maybeDarkPairs) {
    return createThemeFromPalettePairs(
      maybeLightPairs ?? DEFAULT_THEME_PALETTE_BY_MODE.light.colorPairs,
      maybeDarkPairs ?? DEFAULT_THEME_PALETTE_BY_MODE.dark.colorPairs,
    )
  }

  const legacyV1Pairs = parseThemeColorPairsFromUnknown(value.colorPairs, 'light')
  if (legacyV1Pairs) {
    return createThemeFromPalettePairs(legacyV1Pairs, [])
  }

  const hasLegacyShape =
    'background' in value ||
    'foreground' in value ||
    'primary' in value ||
    'primaryForeground' in value

  if (!hasLegacyShape) {
    return null
  }

  let nextTheme = cloneMainTheme(DEFAULT_MAIN_THEME)
  ;(['light', 'dark'] as const).forEach((mode) => {
    const backgroundPair = getThemeColorPair(nextTheme, mode, 'background')
    nextTheme = updateThemeColorPair(nextTheme, mode, 'background', {
      color: ensureThemeColor(value.background, backgroundPair?.color ?? '#ffffff'),
      foreground: ensureThemeColor(
        value.foreground,
        backgroundPair?.foreground ?? '#111827',
      ),
    })

    const primaryPair = getThemeColorPair(nextTheme, mode, 'primary')
    nextTheme = updateThemeColorPair(nextTheme, mode, 'primary', {
      color: ensureThemeColor(value.primary, primaryPair?.color ?? '#111827'),
      foreground: ensureThemeColor(
        value.primaryForeground,
        primaryPair?.foreground ?? '#f9fafb',
      ),
    })
  })

  return nextTheme
}

export function isMainTheme(value: unknown): value is MainTheme {
  if (!isRecord(value)) {
    return false
  }

  if (
    !isRecord(value.light) ||
    !Array.isArray(value.light.colorPairs) ||
    !isRecord(value.dark) ||
    !Array.isArray(value.dark.colorPairs)
  ) {
    return false
  }

  const validatePalette = (paletteValue: unknown): string[] | null => {
    if (!isRecord(paletteValue) || !Array.isArray(paletteValue.colorPairs)) {
      return null
    }

    const names: string[] = []
    const seen = new Set<string>()

    for (const pairValue of paletteValue.colorPairs) {
      if (!isRecord(pairValue)) {
        return null
      }

      const rawName = typeof pairValue.name === 'string' ? pairValue.name : ''
      const normalizedName = normalizeThemePairName(rawName)
      if (!normalizedName || rawName !== normalizedName || seen.has(normalizedName)) {
        return null
      }
      seen.add(normalizedName)

      if (
        typeof pairValue.label !== 'string' ||
        !isThemeColor(pairValue.color) ||
        !isThemeColor(pairValue.foreground) ||
        typeof pairValue.includeInButtonVariant !== 'boolean' ||
        typeof pairValue.isCustom !== 'boolean'
      ) {
        return null
      }

      names.push(normalizedName)
    }

    return names
  }

  const lightPairNames = validatePalette(value.light)
  if (!lightPairNames) {
    return false
  }

  const darkPairNames = validatePalette(value.dark)
  if (!darkPairNames || darkPairNames.length !== lightPairNames.length) {
    return false
  }

  for (let index = 0; index < lightPairNames.length; index += 1) {
    if (lightPairNames[index] !== darkPairNames[index]) {
      return false
    }
  }

  return true
}

export function parseMainTheme(raw: string): MainTheme | null {
  try {
    const parsed: unknown = JSON.parse(raw)
    return normalizeMainTheme(parsed)
  } catch {
    return null
  }
}

export function loadMainTheme(): MainTheme {
  if (typeof window === 'undefined') {
    return cloneMainTheme(DEFAULT_MAIN_THEME)
  }

  const rawV2 = window.localStorage.getItem(MAIN_THEME_STORAGE_KEY)
  if (rawV2) {
    const parsedV2 = parseMainTheme(rawV2)
    if (parsedV2) {
      return parsedV2
    }
  }

  const rawV1 = window.localStorage.getItem(LEGACY_MAIN_THEME_STORAGE_KEY)
  if (rawV1) {
    const parsedV1 = parseMainTheme(rawV1)
    if (parsedV1) {
      saveMainTheme(parsedV1)
      return parsedV1
    }
  }

  return cloneMainTheme(DEFAULT_MAIN_THEME)
}

export function saveMainTheme(theme: MainTheme) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(MAIN_THEME_STORAGE_KEY, JSON.stringify(theme))
}

export function getThemeColorPairs(
  theme: MainTheme,
  mode: ThemeMode,
): ThemeColorPair[] {
  return [...getThemePalette(theme, mode).colorPairs]
}

export function getBuiltInThemeColorPairs(
  theme: MainTheme,
  mode: ThemeMode,
): ThemeColorPair[] {
  return getThemePalette(theme, mode).colorPairs.filter((pair) => !pair.isCustom)
}

export function getCustomThemeColorPairs(
  theme: MainTheme,
  mode: ThemeMode,
): ThemeColorPair[] {
  return getThemePalette(theme, mode).colorPairs.filter((pair) => pair.isCustom)
}

export function getThemeColorPair(
  theme: MainTheme,
  mode: ThemeMode,
  pairName: string,
): ThemeColorPair | null {
  const normalizedName = normalizeThemePairName(pairName)
  if (!normalizedName) {
    return null
  }

  const palette = getThemePalette(theme, mode)
  const pair = palette.colorPairs.find(
    (candidate) => candidate.name === normalizedName,
  )
  if (pair) {
    return pair
  }

  return getDefaultThemePair(mode, normalizedName)
}

export function updateThemeColorPair(
  theme: MainTheme,
  mode: ThemeMode,
  pairName: string,
  updates: Partial<
    Pick<ThemeColorPair, 'label' | 'color' | 'foreground' | 'includeInButtonVariant'>
  >,
): MainTheme {
  const normalizedName = normalizeThemePairName(pairName)
  if (!normalizedName) {
    return theme
  }

  const hasPairInLight = theme.light.colorPairs.some(
    (pair) => pair.name === normalizedName,
  )
  const hasPairInDark = theme.dark.colorPairs.some(
    (pair) => pair.name === normalizedName,
  )
  if (!hasPairInLight && !hasPairInDark) {
    return theme
  }

  const nextLabel =
    typeof updates.label === 'string' && updates.label.trim().length > 0
      ? updates.label.trim()
      : null
  const nextIncludeInButtonVariant =
    updates.includeInButtonVariant === undefined
      ? null
      : Boolean(updates.includeInButtonVariant)

  const updatePalettePairs = (
    currentMode: ThemeMode,
    pairs: ThemeColorPair[],
  ): ThemeColorPair[] =>
    pairs.map((pair) => {
      if (pair.name !== normalizedName) {
        return pair
      }

      const shouldUpdateColors = currentMode === mode
      return {
        ...pair,
        label: pair.isCustom && nextLabel ? nextLabel : pair.label,
        color: shouldUpdateColors ? ensureThemeColor(updates.color, pair.color) : pair.color,
        foreground: shouldUpdateColors
          ? ensureThemeColor(updates.foreground, pair.foreground)
          : pair.foreground,
        includeInButtonVariant: pair.isCustom
          ? (nextIncludeInButtonVariant ?? pair.includeInButtonVariant)
          : false,
      }
    })

  return createThemeFromPalettePairs(
    updatePalettePairs('light', theme.light.colorPairs),
    updatePalettePairs('dark', theme.dark.colorPairs),
  )
}

export function addCustomThemeColorPair(
  theme: MainTheme,
  input: AddThemeColorPairInput,
): AddThemeColorPairResult {
  const normalizedName = normalizeThemePairName(input.name)
  if (!normalizedName) {
    return {
      theme,
      error: 'Name must start with a letter and use only a-z, 0-9, or -.',
    }
  }

  if (BUILT_IN_THEME_PAIR_NAMES.has(normalizedName)) {
    return { theme, error: 'This semantic pair already exists.' }
  }

  if (RESERVED_BUTTON_VARIANT_NAMES.has(normalizedName)) {
    return {
      theme,
      error: 'This name conflicts with an existing button variant.',
    }
  }

  if (
    theme.light.colorPairs.some((pair) => pair.name === normalizedName) ||
    theme.dark.colorPairs.some((pair) => pair.name === normalizedName)
  ) {
    return { theme, error: 'A pair with this name already exists.' }
  }

  const label =
    typeof input.label === 'string' && input.label.trim().length > 0
      ? input.label.trim()
      : startCase(normalizedName)
  const includeInButtonVariant = Boolean(input.includeInButtonVariant)

  const nextLightPair = createCustomPairForPalette(theme.light, 'light', {
    name: normalizedName,
    label,
    includeInButtonVariant,
    color: input.color,
    foreground: input.foreground,
  })
  const nextDarkPair = createCustomPairForPalette(theme.dark, 'dark', {
    name: normalizedName,
    label,
    includeInButtonVariant,
    color: input.color,
    foreground: input.foreground,
  })

  return {
    theme: createThemeFromPalettePairs(
      [...theme.light.colorPairs, nextLightPair],
      [...theme.dark.colorPairs, nextDarkPair],
    ),
    error: null,
  }
}

export function getMainThemeCss(
  theme: MainTheme,
  colorFormat: CssExportColorFormat = 'oklch',
): string {
  const lightTheme = mapThemeVariablesForExport(
    getThemeVariablesWithOverrides(theme, 'light'),
    colorFormat,
  )
  const darkTheme = mapThemeVariablesForExport(
    getThemeVariablesWithOverrides(theme, 'dark'),
    colorFormat,
  )

  return [
    formatThemeInlineBlock(theme),
    formatCssVariableBlock(':root', lightTheme),
    formatCssVariableBlock('.dark', darkTheme),
  ].join('\n\n')
}

export function getMainThemeComponentTsx(theme: MainTheme): string {
  const customVariantLines = getCustomThemeColorPairs(theme, 'light')
    .filter((pair) => pair.includeInButtonVariant)
    .map(
      (pair) =>
        `        '${pair.name}': 'bg-${pair.name} text-${pair.name}-foreground hover:bg-${pair.name}/90',`,
    )

  const customVariantBlock =
    customVariantLines.length > 0 ? `\n${customVariantLines.join('\n')}` : ''

  return `import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',${customVariantBlock}
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-xs': "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
`
}
