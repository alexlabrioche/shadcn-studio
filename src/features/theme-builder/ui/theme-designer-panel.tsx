import * as React from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  addCustomThemeColorPair,
  getBuiltInThemeColorPairs,
  getCustomThemeColorPairs,
  updateThemeColorPair,
} from '@/features/theme-builder/model/theme'
import type {
  MainTheme,
  ThemeColorPair,
  ThemeMode,
} from '@/features/theme-builder/model/theme'
import { ColorField } from '@/features/theme-builder/ui/color-field'

interface ThemeDesignerPanelProps {
  theme: MainTheme
  onThemeChange: (updater: (previous: MainTheme) => MainTheme) => void
}

interface CombinedThemeColorPair {
  light: ThemeColorPair
  dark: ThemeColorPair
}

interface ColorPairEditorProps {
  pair: CombinedThemeColorPair
  onColorChange: (mode: ThemeMode, value: string) => void
  onForegroundChange: (mode: ThemeMode, value: string) => void
  onIncludeInButtonVariantChange?: (value: boolean) => void
}

function combineThemeColorPairs(
  lightPairs: ThemeColorPair[],
  darkPairs: ThemeColorPair[],
): CombinedThemeColorPair[] {
  const lightByName = new Map(lightPairs.map((pair) => [pair.name, pair]))
  const darkByName = new Map(darkPairs.map((pair) => [pair.name, pair]))

  const orderedNames = [
    ...lightPairs.map((pair) => pair.name),
    ...darkPairs
      .map((pair) => pair.name)
      .filter((name) => !lightByName.has(name)),
  ]

  return orderedNames.flatMap((name) => {
    const lightPair = lightByName.get(name)
    const darkPair = darkByName.get(name)
    if (!lightPair || !darkPair) {
      return []
    }

    return [{ light: lightPair, dark: darkPair }]
  })
}

function ColorPairEditor({
  pair,
  onColorChange,
  onForegroundChange,
  onIncludeInButtonVariantChange,
}: ColorPairEditorProps) {
  return (
    <AccordionItem value={pair.light.name}>
      <AccordionTrigger className="py-3 px-2 hover:no-underline">
        <p className="truncate text-base font-semibold">{pair.light.label}</p>
      </AccordionTrigger>
      <AccordionContent className="space-y-3 p-2">
        <div className="grid gap-3 xl:grid-cols-2">
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm font-semibold">Light</p>
            <ColorField
              label={pair.light.name}
              value={pair.light.color}
              pickerFallbackHex="#111827"
              onChange={(value) => onColorChange('light', value)}
            />
            <ColorField
              label={`${pair.light.name}-foreground`}
              value={pair.light.foreground}
              pickerFallbackHex="#f9fafb"
              onChange={(value) => onForegroundChange('light', value)}
            />
          </div>

          <div className="space-y-3">
            <p className="text-muted-foreground text-sm font-semibold">Dark</p>
            <ColorField
              label={pair.dark.name}
              value={pair.dark.color}
              pickerFallbackHex="#111827"
              onChange={(value) => onColorChange('dark', value)}
            />
            <ColorField
              label={`${pair.dark.name}-foreground`}
              value={pair.dark.foreground}
              pickerFallbackHex="#f9fafb"
              onChange={(value) => onForegroundChange('dark', value)}
            />
          </div>
        </div>

        {onIncludeInButtonVariantChange ? (
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Add to button cva</span>
            <Switch
              checked={pair.light.includeInButtonVariant}
              onCheckedChange={onIncludeInButtonVariantChange}
              aria-label={`Include ${pair.light.name} as button variant`}
            />
          </label>
        ) : null}
      </AccordionContent>
    </AccordionItem>
  )
}

export function ThemeDesignerPanel({
  theme,
  onThemeChange,
}: ThemeDesignerPanelProps) {
  const [newPairName, setNewPairName] = React.useState('')
  const [includeInButtonVariant, setIncludeInButtonVariant] =
    React.useState(false)
  const [addPairError, setAddPairError] = React.useState<string | null>(null)

  const builtInPairs = React.useMemo(
    () =>
      combineThemeColorPairs(
        getBuiltInThemeColorPairs(theme, 'light'),
        getBuiltInThemeColorPairs(theme, 'dark'),
      ),
    [theme],
  )
  const customPairs = React.useMemo(
    () =>
      combineThemeColorPairs(
        getCustomThemeColorPairs(theme, 'light'),
        getCustomThemeColorPairs(theme, 'dark'),
      ),
    [theme],
  )

  const handleAddPair = React.useCallback(() => {
    const result = addCustomThemeColorPair(theme, {
      name: newPairName,
      includeInButtonVariant,
    })

    if (result.error) {
      setAddPairError(result.error)
      return
    }

    setAddPairError(null)
    onThemeChange(() => result.theme)
    setNewPairName('')
    setIncludeInButtonVariant(false)
  }, [includeInButtonVariant, newPairName, onThemeChange, theme])

  return (
    <div className="space-y-6">
      <div className="p-2">
        <h2 className="text-base font-semibold">Theme Designer</h2>
        <p className="text-muted-foreground text-xs">
          Light and dark tokens are editable together.
        </p>
      </div>

      <section className="space-y-2">
        <Accordion
          type="multiple"
          defaultValue={builtInPairs.map((pair) => pair.light.name)}
        >
          {builtInPairs.map((pair) => (
            <ColorPairEditor
              key={pair.light.name}
              pair={pair}
              onColorChange={(mode, value) =>
                onThemeChange((previous) =>
                  updateThemeColorPair(previous, mode, pair.light.name, {
                    color: value,
                  }),
                )
              }
              onForegroundChange={(mode, value) =>
                onThemeChange((previous) =>
                  updateThemeColorPair(previous, mode, pair.light.name, {
                    foreground: value,
                  }),
                )
              }
            />
          ))}
        </Accordion>
      </section>

      <section className="space-y-2 p-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold">Custom Color Pairs</p>
          <span className="text-muted-foreground text-xs">
            {customPairs.length} pair{customPairs.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="space-y-3 rounded-md border p-3">
          <div className="space-y-1">
            <label className="text-xs" htmlFor="new-color-pair-name">
              Pair Name
            </label>
            <Input
              id="new-color-pair-name"
              value={newPairName}
              onChange={(event) => setNewPairName(event.target.value)}
              placeholder="brand"
              className="font-mono text-xs"
            />
          </div>

          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Add to button cva</span>
            <Switch
              checked={includeInButtonVariant}
              onCheckedChange={setIncludeInButtonVariant}
            />
          </label>

          {addPairError ? (
            <p className="text-destructive text-xs">{addPairError}</p>
          ) : null}

          <div className="flex justify-end">
            <Button size="sm" onClick={handleAddPair}>
              Add Color Pair
            </Button>
          </div>
        </div>

        {customPairs.length > 0 ? (
          <Accordion
            type="multiple"
            defaultValue={customPairs.map((pair) => pair.light.name)}
          >
            {customPairs.map((pair) => (
              <ColorPairEditor
                key={pair.light.name}
                pair={pair}
                onColorChange={(mode, value) =>
                  onThemeChange((previous) =>
                    updateThemeColorPair(previous, mode, pair.light.name, {
                      color: value,
                    }),
                  )
                }
                onForegroundChange={(mode, value) =>
                  onThemeChange((previous) =>
                    updateThemeColorPair(previous, mode, pair.light.name, {
                      foreground: value,
                    }),
                  )
                }
                onIncludeInButtonVariantChange={(checked) =>
                  onThemeChange((previous) =>
                    updateThemeColorPair(previous, 'light', pair.light.name, {
                      includeInButtonVariant: checked,
                    }),
                  )
                }
              />
            ))}
          </Accordion>
        ) : null}
      </section>
    </div>
  )
}
