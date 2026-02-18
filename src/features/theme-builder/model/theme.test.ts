import { describe, expect, it } from 'vitest'

import {
  DEFAULT_MAIN_THEME,
  addCustomThemeColorPair,
  getMainThemeComponentTsx,
  getMainThemeCss,
  getThemeColorPair,
  isMainTheme,
  normalizeThemeColor,
  parseMainTheme,
  toHexColor,
  toOklchColor,
  updateThemeColorPair,
} from '@/features/theme-builder/model/theme'

describe('theme model', () => {
  it('validates theme shape', () => {
    expect(isMainTheme(DEFAULT_MAIN_THEME)).toBe(true)
    expect(isMainTheme({ colorPairs: [] })).toBe(true)
    expect(isMainTheme({ background: 'x' })).toBe(false)
  })

  it('parses valid JSON and migrates legacy payloads', () => {
    const raw = JSON.stringify(DEFAULT_MAIN_THEME)
    expect(parseMainTheme(raw)).toEqual(DEFAULT_MAIN_THEME)

    const legacy = parseMainTheme(
      JSON.stringify({
        background: '#000000',
        foreground: '#ffffff',
        primary: '#111111',
        primaryForeground: '#f5f5f5',
      }),
    )

    expect(legacy).not.toBeNull()
    expect(getThemeColorPair(legacy!, 'background')?.color).toBe('#000000')
    expect(getThemeColorPair(legacy!, 'background')?.foreground).toBe('#ffffff')
    expect(getThemeColorPair(legacy!, 'primary')?.color).toBe('#111111')
    expect(getThemeColorPair(legacy!, 'primary')?.foreground).toBe('#f5f5f5')
  })

  it('normalizes and converts theme colors', () => {
    expect(normalizeThemeColor('#ABC')).toBe('#aabbcc')
    expect(normalizeThemeColor('oklch(100% 0 0)')).toBe('oklch(1 0 0)')
    expect(normalizeThemeColor('rgb(0 0 0)')).toBeNull()
    expect(toHexColor('oklch(1 0 0)')).toBe('#ffffff')
    expect(toOklchColor('#ffffff')).toBe('oklch(1 0 0)')
  })

  it('creates export css with semantic pair overrides and custom pairs', () => {
    const withPairUpdates = updateThemeColorPair(DEFAULT_MAIN_THEME, 'card', {
      color: '#123456',
      foreground: '#f0f0f0',
    })
    const customResult = addCustomThemeColorPair(withPairUpdates, {
      name: 'brand',
      includeInButtonVariant: true,
      color: '#222222',
      foreground: '#eeeeee',
    })

    expect(customResult.error).toBeNull()

    const css = getMainThemeCss(customResult.theme, 'oklch')

    expect(css).toContain('@theme inline {')
    expect(css).toContain('--color-brand: var(--brand);')
    expect(css).toContain('--color-brand-foreground: var(--brand-foreground);')
    expect(css).toContain('--card: oklch(')
    expect(css).toContain('--brand: oklch(')
    expect(css).toContain('--brand-foreground: oklch(')
  })

  it('creates hex export css without oklch values', () => {
    const customResult = addCustomThemeColorPair(DEFAULT_MAIN_THEME, {
      name: 'brand',
      includeInButtonVariant: false,
      color: 'oklch(1 0 0)',
      foreground: 'oklch(0 0 0)',
    })

    const css = getMainThemeCss(customResult.theme, 'hex')

    expect(css).toContain('--background: #ffffff;')
    expect(css).toContain('--brand: #ffffff;')
    expect(css).toContain('--brand-foreground: #000000;')
    expect(css).not.toContain('oklch(')
  })

  it('creates button component tsx with custom opt-in variants', () => {
    const withVariant = addCustomThemeColorPair(DEFAULT_MAIN_THEME, {
      name: 'brand',
      includeInButtonVariant: true,
    })
    const withoutVariant = addCustomThemeColorPair(withVariant.theme, {
      name: 'marketing',
      includeInButtonVariant: false,
    })
    const tsx = getMainThemeComponentTsx(withoutVariant.theme)

    expect(tsx).toContain("import { cva } from 'class-variance-authority'")
    expect(tsx).toContain("'brand': 'bg-brand text-brand-foreground hover:bg-brand/90'")
    expect(tsx).not.toContain('marketing')
    expect(tsx).toContain('export { Button, buttonVariants }')
  })
})
