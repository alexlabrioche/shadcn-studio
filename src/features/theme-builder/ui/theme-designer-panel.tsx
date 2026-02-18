import * as React from 'react'

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
  AppAppearance,
  MainTheme,
  ThemeColorPair,
  ThemeMode,
} from '@/features/theme-builder/model/theme'
import { ColorField } from '@/features/theme-builder/ui/color-field'

interface ThemeDesignerPanelProps {
  theme: MainTheme
  mode: ThemeMode
  appAppearance: AppAppearance
  onModeChange: (mode: ThemeMode) => void
  onAppAppearanceChange: (appAppearance: AppAppearance) => void
  onThemeChange: (updater: (previous: MainTheme) => MainTheme) => void
}

interface ColorPairEditorProps {
  pair: ThemeColorPair
  onColorChange: (value: string) => void
  onForegroundChange: (value: string) => void
  onIncludeInButtonVariantChange?: (value: boolean) => void
}

function ColorPairEditor({
  pair,
  onColorChange,
  onForegroundChange,
  onIncludeInButtonVariantChange,
}: ColorPairEditorProps) {
  return (
    <div className="rounded-md border p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{pair.label}</p>
          <p className="text-muted-foreground truncate text-xs font-mono">
            {pair.name}
          </p>
        </div>
        {onIncludeInButtonVariantChange ? (
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">cva variant</span>
            <Switch
              checked={pair.includeInButtonVariant}
              onCheckedChange={onIncludeInButtonVariantChange}
              aria-label={`Include ${pair.name} as button variant`}
            />
          </label>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <ColorField
          label={pair.name}
          value={pair.color}
          pickerFallbackHex="#111827"
          onChange={onColorChange}
        />
        <ColorField
          label={`${pair.name}-foreground`}
          value={pair.foreground}
          pickerFallbackHex="#f9fafb"
          onChange={onForegroundChange}
        />
      </div>
    </div>
  )
}

export function ThemeDesignerPanel({
  theme,
  mode,
  appAppearance,
  onModeChange,
  onAppAppearanceChange,
  onThemeChange,
}: ThemeDesignerPanelProps) {
  const [newPairName, setNewPairName] = React.useState('')
  const [includeInButtonVariant, setIncludeInButtonVariant] =
    React.useState(false)
  const [addPairError, setAddPairError] = React.useState<string | null>(null)

  const builtInPairs = React.useMemo(
    () => getBuiltInThemeColorPairs(theme, mode),
    [mode, theme],
  )
  const customPairs = React.useMemo(
    () => getCustomThemeColorPairs(theme, mode),
    [mode, theme],
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
    <div className="space-y-4 p-4">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Theme Designer</h2>
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Dark mode</span>
            <Switch
              checked={appAppearance === 'dark'}
              onCheckedChange={(checked) =>
                onAppAppearanceChange(checked ? 'dark' : 'light')
              }
              aria-label="Toggle app dark mode"
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-xs">Editing tokens</span>
          <div className="inline-flex items-center gap-1 rounded-md border p-1">
            <Button
              type="button"
              size="sm"
              variant={mode === 'light' ? 'secondary' : 'ghost'}
              onClick={() => onModeChange('light')}
            >
              Light
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode === 'dark' ? 'secondary' : 'ghost'}
              onClick={() => onModeChange('dark')}
            >
              Dark
            </Button>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <section className="space-y-2">
          <p className="text-sm font-medium">Semantic Color Pairs</p>
          <p className="text-muted-foreground text-xs">
            Every token is grouped as <code>{'{color}'}</code> +{' '}
            <code>{'{color}-foreground'}</code>.
          </p>

          <div className="space-y-2">
            {builtInPairs.map((pair) => (
              <ColorPairEditor
                key={pair.name}
                pair={pair}
                onColorChange={(value) =>
                  onThemeChange((previous) =>
                    updateThemeColorPair(previous, mode, pair.name, { color: value }),
                  )
                }
                onForegroundChange={(value) =>
                  onThemeChange((previous) =>
                    updateThemeColorPair(previous, mode, pair.name, {
                      foreground: value,
                    }),
                  )
                }
              />
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium">Custom Color Pairs</p>
            <span className="text-muted-foreground text-xs">
              {customPairs.length} pair{customPairs.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="rounded-md border p-3">
            <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
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
            </div>

            {addPairError ? (
              <p className="text-destructive mt-2 text-xs">{addPairError}</p>
            ) : null}

            <div className="mt-3 flex justify-end">
              <Button size="sm" onClick={handleAddPair}>
                Add Color Pair
              </Button>
            </div>
          </div>

          {customPairs.length > 0 ? (
            <div className="space-y-2">
              {customPairs.map((pair) => (
                <ColorPairEditor
                  key={pair.name}
                  pair={pair}
                  onColorChange={(value) =>
                    onThemeChange((previous) =>
                      updateThemeColorPair(previous, mode, pair.name, {
                        color: value,
                      }),
                    )
                  }
                  onForegroundChange={(value) =>
                    onThemeChange((previous) =>
                      updateThemeColorPair(previous, mode, pair.name, {
                        foreground: value,
                      }),
                    )
                  }
                  onIncludeInButtonVariantChange={(checked) =>
                    onThemeChange((previous) =>
                      updateThemeColorPair(previous, mode, pair.name, {
                        includeInButtonVariant: checked,
                      }),
                    )
                  }
                />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}
