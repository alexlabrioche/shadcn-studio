import { describe, expect, it } from 'vitest'

import {
  DEFAULT_MAIN_THEME,
  getMainThemeComponentTsx,
  getMainThemeCss,
  isMainTheme,
  normalizeThemeColor,
  parseMainTheme,
  toHexColor,
  toOklchColor,
} from '@/features/theme-builder/model/theme'

describe('theme model', () => {
  it('validates theme shape', () => {
    expect(isMainTheme(DEFAULT_MAIN_THEME)).toBe(true)
    expect(isMainTheme({ background: 'x' })).toBe(false)
    expect(
      isMainTheme({
        ...DEFAULT_MAIN_THEME,
        primary: 'oklch(0.5 0.1 20)',
      }),
    ).toBe(true)
  })

  it('parses valid JSON and rejects invalid payloads', () => {
    const raw = JSON.stringify(DEFAULT_MAIN_THEME)
    expect(parseMainTheme(raw)).toEqual(DEFAULT_MAIN_THEME)
    expect(parseMainTheme('{"bad":"shape"}')).toBeNull()
    expect(parseMainTheme('not-json')).toBeNull()
  })

  it('normalizes and converts theme colors', () => {
    expect(normalizeThemeColor('#ABC')).toBe('#aabbcc')
    expect(normalizeThemeColor('oklch(100% 0 0)')).toBe('oklch(1 0 0)')
    expect(normalizeThemeColor('rgb(0 0 0)')).toBeNull()
    expect(toHexColor('oklch(1 0 0)')).toBe('#ffffff')
    expect(toOklchColor('#ffffff')).toBe('oklch(1 0 0)')
  })

  it('creates oklch export css with shadcn defaults and custom overrides', () => {
    const css = getMainThemeCss(
      {
        ...DEFAULT_MAIN_THEME,
        background: '#123456',
        foreground: '#abcdef',
        primary: '#0f0f0f',
        primaryForeground: '#fefefe',
      },
      'oklch',
    )

    expect(css).toContain('@theme inline {')
    expect(css).toContain(':root {')
    expect(css).toContain('.dark {')
    expect(css).toContain('--radius: 0.625rem;')
    expect(css).toContain('--chart-5: oklch(0.645 0.246 16.439);')
    expect(css).toContain('--background: oklch(')
    expect(css).toContain('--background: oklch(0.147 0.004 49.25);')
  })

  it('creates hex export css without oklch values', () => {
    const css = getMainThemeCss(
      {
        ...DEFAULT_MAIN_THEME,
        background: 'oklch(1 0 0)',
        foreground: 'oklch(0 0 0)',
        primary: 'oklch(0.21 0.03 250)',
        primaryForeground: 'oklch(0.98 0.01 250)',
      },
      'hex',
    )

    expect(css).toContain('--background: #ffffff;')
    expect(css).toContain('--foreground: #000000;')
    expect(css).not.toContain('oklch(')
  })

  it('creates a raw button component tsx export', () => {
    const tsx = getMainThemeComponentTsx()

    expect(tsx).toContain("import { cva } from 'class-variance-authority'")
    expect(tsx).toContain("import { Slot } from 'radix-ui'")
    expect(tsx).toContain("import { cn } from '@/lib/utils'")
    expect(tsx).toContain('const buttonVariants = cva(')
    expect(tsx).toContain('function Button({')
    expect(tsx).toContain('export { Button, buttonVariants }')
    expect(tsx).not.toContain('themeStyle')
  })
})
