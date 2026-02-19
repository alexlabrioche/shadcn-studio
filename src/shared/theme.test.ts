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
} from '@/shared/theme'

describe('theme model', () => {
  it('validates v2 theme shape', () => {
    expect(isMainTheme(DEFAULT_MAIN_THEME)).toBe(true)
    expect(
      isMainTheme({
        light: { colorPairs: [] },
        dark: { colorPairs: [] },
      }),
    ).toBe(true)
    expect(isMainTheme({ colorPairs: [] })).toBe(false)
  })

  it('parses v2 payload and migrates v1 + legacy payloads', () => {
    const v2Raw = JSON.stringify(DEFAULT_MAIN_THEME)
    expect(parseMainTheme(v2Raw)).toEqual(DEFAULT_MAIN_THEME)

    const v1 = parseMainTheme(
      JSON.stringify({
        colorPairs: [
          {
            name: 'background',
            label: 'Background',
            color: '#010101',
            foreground: '#fefefe',
            includeInButtonVariant: false,
            isCustom: false,
          },
          {
            name: 'brand',
            label: 'Brand',
            color: '#112233',
            foreground: '#ffffff',
            includeInButtonVariant: true,
            isCustom: true,
          },
        ],
      }),
    )

    expect(v1).not.toBeNull()
    expect(getThemeColorPair(v1!, 'light', 'background')?.color).toBe('#010101')
    expect(getThemeColorPair(v1!, 'light', 'brand')?.color).toBe('#112233')
    expect(getThemeColorPair(v1!, 'dark', 'brand')).not.toBeNull()
    expect(getThemeColorPair(v1!, 'dark', 'brand')?.color).toBe(
      getThemeColorPair(v1!, 'dark', 'primary')?.color,
    )

    const legacy = parseMainTheme(
      JSON.stringify({
        background: '#000000',
        foreground: '#ffffff',
        primary: '#111111',
        primaryForeground: '#f5f5f5',
      }),
    )

    expect(legacy).not.toBeNull()
    expect(getThemeColorPair(legacy!, 'light', 'background')?.color).toBe('#000000')
    expect(getThemeColorPair(legacy!, 'dark', 'background')?.color).toBe('#000000')
    expect(getThemeColorPair(legacy!, 'light', 'primary')?.foreground).toBe(
      '#f5f5f5',
    )
    expect(getThemeColorPair(legacy!, 'dark', 'primary')?.foreground).toBe(
      '#f5f5f5',
    )
  })

  it('normalizes and converts theme colors', () => {
    expect(normalizeThemeColor('#ABC')).toBe('#aabbcc')
    expect(normalizeThemeColor('oklch(100% 0 0)')).toBe('oklch(1 0 0)')
    expect(normalizeThemeColor('rgb(0 0 0)')).toBeNull()
    expect(toHexColor('oklch(1 0 0)')).toBe('#ffffff')
    expect(toOklchColor('#ffffff')).toBe('oklch(1 0 0)')
  })

  it('updates light and dark palettes independently', () => {
    const updatedLight = updateThemeColorPair(DEFAULT_MAIN_THEME, 'light', 'primary', {
      color: '#123456',
    })
    expect(getThemeColorPair(updatedLight, 'light', 'primary')?.color).toBe('#123456')
    expect(getThemeColorPair(updatedLight, 'dark', 'primary')?.color).toBe(
      getThemeColorPair(DEFAULT_MAIN_THEME, 'dark', 'primary')?.color,
    )

    const updatedDark = updateThemeColorPair(updatedLight, 'dark', 'primary', {
      color: '#654321',
    })
    expect(getThemeColorPair(updatedDark, 'dark', 'primary')?.color).toBe('#654321')
    expect(getThemeColorPair(updatedDark, 'light', 'primary')?.color).toBe('#123456')
  })

  it('adds custom pairs in both palettes and keeps cva inclusion metadata synced', () => {
    const result = addCustomThemeColorPair(DEFAULT_MAIN_THEME, {
      name: 'brand',
      includeInButtonVariant: true,
    })

    expect(result.error).toBeNull()
    expect(getThemeColorPair(result.theme, 'light', 'brand')).not.toBeNull()
    expect(getThemeColorPair(result.theme, 'dark', 'brand')).not.toBeNull()
    expect(getThemeColorPair(result.theme, 'light', 'brand')?.includeInButtonVariant).toBe(
      true,
    )
    expect(getThemeColorPair(result.theme, 'dark', 'brand')?.includeInButtonVariant).toBe(
      true,
    )
  })

  it('exports css with independent :root/.dark values and supports hex output', () => {
    const withCustom = addCustomThemeColorPair(DEFAULT_MAIN_THEME, {
      name: 'brand',
      includeInButtonVariant: false,
    }).theme

    const updated = updateThemeColorPair(withCustom, 'light', 'primary', {
      color: '#111111',
    })
    const updatedBoth = updateThemeColorPair(updated, 'dark', 'primary', {
      color: '#eeeeee',
    })

    const cssOklch = getMainThemeCss(updatedBoth, 'oklch')
    expect(cssOklch).toContain('@theme inline {')
    expect(cssOklch).toContain(':root {')
    expect(cssOklch).toContain('.dark {')
    expect(cssOklch).toContain('--color-brand: var(--brand);')

    const cssHex = getMainThemeCss(updatedBoth, 'hex')
    expect(cssHex).toContain('--primary: #111111;')
    expect(cssHex).toContain('--primary: #eeeeee;')
    expect(cssHex).toContain('--brand:')
    expect(cssHex).not.toContain('oklch(')
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
